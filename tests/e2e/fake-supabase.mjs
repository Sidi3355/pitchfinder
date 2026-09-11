// A small stand-in for Supabase used by the end-to-end tests: a real Postgres
// with the real migrations and RLS (via tests/rls/harness.mjs) behind the
// subset of the PostgREST and GoTrue HTTP APIs that supabase-js uses here.
// Nothing in the app knows it is fake. Without DATABASE_URL it still starts,
// answers /health, and returns 503 to everything else so account tests skip.
//
// Test-only endpoints:
//   GET /__test/magic-link?email=...&redirect=...  -> { url } to "click"

import { createServer } from 'node:http'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { createTestDatabase } from '../rls/harness.mjs'

const args = process.argv.slice(2)
const PORT = Number(args[args.indexOf('--port') + 1] || process.env.FAKE_SUPABASE_PORT || 4177)
const SECRET = 'pitchfinder-test-secret'
const ANON_KEY = 'test-anon-key'
const TABLES = {
  profiles: ['id'],
  saved_pitches: ['user_id', 'pitch_id'],
  groups: ['id'],
  games: ['id'],
  rsvps: ['id'],
  reports: ['id'],
}
const IDENT = /^[a-z_][a-z0-9_]*$/

// ── JWT (HS256) ──────────────────────────────────────────────────────────────

const b64u = (s) => Buffer.from(s).toString('base64url')
function sign(claims) {
  const head = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64u(JSON.stringify(claims))
  const sig = createHmac('sha256', SECRET).update(`${head}.${body}`).digest('base64url')
  return `${head}.${body}.${sig}`
}
function verify(token) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) return null
  const expected = createHmac('sha256', SECRET).update(`${parts[0]}.${parts[1]}`).digest()
  const given = Buffer.from(parts[2], 'base64url')
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
  if (claims.exp && claims.exp < Date.now() / 1000) return null
  return claims
}

// ── Users (auth.users is real; metadata lives here) ──────────────────────────

const users = new Map() // id -> { id, email, user_metadata }

async function findOrCreateUser(db, email, metadata = {}) {
  for (const u of users.values()) if (u.email === email) return u
  const { rows } = await db.admin('select id from auth.users where email = $1', [email])
  const id = rows[0]?.id || (await db.createUser(email))
  const u = { id, email, user_metadata: metadata }
  users.set(id, u)
  return u
}

function session(u) {
  const now = Math.floor(Date.now() / 1000)
  const access_token = sign({
    sub: u.id,
    email: u.email,
    role: 'authenticated',
    aud: 'authenticated',
    iat: now,
    exp: now + 3600,
  })
  return {
    access_token,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: `refresh-${u.id}`,
    user: userJson(u),
  }
}

function userJson(u) {
  return {
    id: u.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: u.email,
    email_confirmed_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: u.user_metadata || {},
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

// ── PostgREST subset ─────────────────────────────────────────────────────────

function parseFilter(key, raw) {
  if (!IDENT.test(key)) throw httpError(400, `bad column ${key}`)
  const dot = raw.indexOf('.')
  const op = dot < 0 ? 'eq' : raw.slice(0, dot)
  const val = dot < 0 ? raw : raw.slice(dot + 1)
  switch (op) {
    case 'eq':
      return { sql: (p) => `${key} = $${p.push(val)}`, key }
    case 'neq':
      return { sql: (p) => `${key} <> $${p.push(val)}`, key }
    case 'is':
      return {
        sql: () => `${key} is ${val === 'null' ? 'null' : val === 'true' ? 'true' : 'false'}`,
        key,
      }
    case 'in': {
      const items = val
        .replace(/^\(|\)$/g, '')
        .split(',')
        .map((s) => s.replace(/^"|"$/g, ''))
      return { sql: (p) => `"${key}" = any($${p.push(items)})`, key }
    }
    default:
      throw httpError(400, `unsupported operator ${op}`)
  }
}

function selectList(select) {
  if (!select || select === '*') return '*'
  const cols = select.split(',').map((c) => c.trim())
  for (const c of cols) if (!IDENT.test(c)) throw httpError(400, `unsupported select ${c}`)
  return cols.map((c) => `"${c}"`).join(', ')
}

function orderClause(order) {
  if (!order) return ''
  const parts = order.split(',').map((o) => {
    const [col, ...mods] = o.split('.')
    if (!IDENT.test(col)) throw httpError(400, 'bad order')
    const dir = mods.includes('desc') ? 'desc' : 'asc'
    const nulls = mods.includes('nullsfirst')
      ? ' nulls first'
      : mods.includes('nullslast')
        ? ' nulls last'
        : ''
    return `"${col}" ${dir}${nulls}`
  })
  return ` order by ${parts.join(', ')}`
}

function httpError(status, message, extra = {}) {
  const e = new Error(message)
  e.status = status
  e.extra = extra
  return e
}

async function restQuery(db, req, url, table, body) {
  if (!TABLES[table]) throw httpError(404, `relation "${table}" does not exist`, { code: '42P01' })
  const params = []
  const filters = []
  let select = '*'
  let order = ''
  let limit = ''
  let onConflict = null
  for (const [k, v] of url.searchParams) {
    if (k === 'select') select = selectList(v)
    else if (k === 'order') order = orderClause(v)
    else if (k === 'limit') limit = ` limit ${Number(v) || 0}`
    else if (k === 'offset') limit += ` offset ${Number(v) || 0}`
    else if (k === 'on_conflict') onConflict = v.split(',').map((c) => c.trim())
    else if (k === 'columns') continue
    else filters.push(parseFilter(k, v))
  }
  const where = filters.length ? ` where ${filters.map((f) => f.sql(params)).join(' and ')}` : ''
  const prefer = String(req.headers.prefer || '')
  const wantRows = /return=representation/.test(prefer)
  const single = /vnd\.pgrst\.object\+json/.test(String(req.headers.accept || ''))

  let text
  if (req.method === 'GET') {
    text = `select ${select} from ${table}${where}${order}${limit}`
  } else if (req.method === 'POST') {
    const rows = Array.isArray(body) ? body : [body]
    if (!rows.length) return { rows: [] }
    const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))]
    for (const c of cols) if (!IDENT.test(c)) throw httpError(400, `bad column ${c}`)
    const values = rows
      .map(
        (r) =>
          `(${cols.map((c) => `$${params.push(r[c] === undefined ? null : typeof r[c] === 'object' && r[c] !== null ? JSON.stringify(r[c]) : r[c])}`).join(', ')})`,
      )
      .join(', ')
    let conflict = ''
    if (/resolution=merge-duplicates/.test(prefer)) {
      const target = onConflict || TABLES[table]
      const updates = cols.filter((c) => !target.includes(c)).map((c) => `"${c}" = excluded."${c}"`)
      conflict = ` on conflict (${target.map((c) => `"${c}"`).join(', ')}) do ${updates.length ? `update set ${updates.join(', ')}` : 'nothing'}`
    } else if (/resolution=ignore-duplicates/.test(prefer)) {
      conflict = ` on conflict do nothing`
    }
    text = `insert into ${table} (${cols.map((c) => `"${c}"`).join(', ')}) values ${values}${conflict}${wantRows ? ` returning ${select}` : ''}`
  } else if (req.method === 'PATCH') {
    const cols = Object.keys(body || {})
    for (const c of cols) if (!IDENT.test(c)) throw httpError(400, `bad column ${c}`)
    if (!cols.length) return { rows: [] }
    const sets = cols.map(
      (c) =>
        `${c} = $${params.push(typeof body[c] === 'object' && body[c] !== null ? JSON.stringify(body[c]) : body[c])}`,
    )
    text = `update ${table} set ${sets.join(', ')}${where}${wantRows ? ` returning ${select}` : ''}`
  } else if (req.method === 'DELETE') {
    text = `delete from ${table}${where}${wantRows ? ` returning ${select}` : ''}`
  } else {
    throw httpError(405, 'method not allowed')
  }

  const run = (q) => q(text, params)
  const result = await (req.userId ? db.asUser(req.userId, run) : db.asAnon(run))
  return { rows: result.rows, single, wantRows, rowCount: result.rowCount }
}

const fnShapes = new Map() // name -> { set: boolean, scalar: boolean }

async function fnShape(db, fn) {
  if (fnShapes.has(fn)) return fnShapes.get(fn)
  const { rows } = await db.admin(
    `select p.proretset as set, t.typtype in ('b', 'd', 'e') as scalar
       from pg_proc p join pg_type t on t.oid = p.prorettype
      where p.proname = $1 and p.pronamespace = 'public'::regnamespace`,
    [fn],
  )
  if (!rows.length) throw httpError(404, `function ${fn} does not exist`, { code: '42883' })
  fnShapes.set(fn, rows[0])
  return rows[0]
}

async function rpc(db, req, fn, body) {
  if (!IDENT.test(fn)) throw httpError(404, 'bad function')
  const shape = await fnShape(db, fn)
  const args = body && typeof body === 'object' ? body : {}
  const params = []
  const named = Object.keys(args).map((k) => {
    if (!IDENT.test(k)) throw httpError(400, `bad argument ${k}`)
    return `${k} => $${params.push(args[k])}`
  })
  // PostgREST returns an array of rows for set-returning functions, the bare
  // value for scalar functions, and an object for composite returns.
  const text = shape.scalar
    ? `select ${fn}(${named.join(', ')}) as result`
    : `select * from ${fn}(${named.join(', ')})`
  const run = (q) => q(text, params)
  const { rows } = await (req.userId ? db.asUser(req.userId, run) : db.asAnon(run))
  if (shape.set) return rows
  if (shape.scalar) return rows[0]?.result ?? null
  return rows[0] ?? null
}

// ── Server ───────────────────────────────────────────────────────────────────

function json(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...cors(), ...headers })
  res.end(data === undefined ? '' : JSON.stringify(data))
}
function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'apikey, authorization, content-type, prefer, accept, x-client-info, x-supabase-api-version, accept-profile, content-profile',
    'Access-Control-Expose-Headers': 'content-range',
  }
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : null)
      } catch {
        resolve(null)
      }
    })
  })
}

const db = process.env.DATABASE_URL ? await createTestDatabase() : null

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors())
    return res.end()
  }
  if (url.pathname === '/health') return json(res, 200, { ok: true, database: !!db })
  if (!db) return json(res, 503, { message: 'no DATABASE_URL: fake Supabase has no database' })

  try {
    const auth = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
    const claims = auth && auth !== ANON_KEY ? verify(auth) : null
    if (auth && auth !== ANON_KEY && !claims) return json(res, 401, { message: 'invalid JWT' })
    req.userId = claims?.sub || null
    const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? await readBody(req) : null

    // Test helper: mint a magic link for an email.
    if (url.pathname === '/__test/magic-link') {
      const email = url.searchParams.get('email')
      const redirect = url.searchParams.get('redirect') || 'http://localhost:4173/'
      const u = await findOrCreateUser(db, email)
      const s = session(u)
      const hash = new URLSearchParams({
        access_token: s.access_token,
        refresh_token: s.refresh_token,
        expires_in: String(s.expires_in),
        expires_at: String(s.expires_at),
        token_type: 'bearer',
        type: 'magiclink',
      })
      return json(res, 200, { url: `${redirect}#${hash}` })
    }

    if (url.pathname === '/__test/reports' && req.method === 'GET') {
      const { rows } = await db.admin('select count(*)::int as n from reports')
      return json(res, 200, { count: rows[0].n })
    }

    // GoTrue subset.
    if (url.pathname === '/auth/v1/user' && req.method === 'GET') {
      if (!claims) return json(res, 401, { message: 'not signed in' })
      const u = users.get(claims.sub) || (await findOrCreateUser(db, claims.email))
      return json(res, 200, userJson(u))
    }
    if (url.pathname === '/auth/v1/otp' && req.method === 'POST') {
      if (!body?.email) return json(res, 400, { message: 'email required' })
      await findOrCreateUser(db, body.email)
      return json(res, 200, {})
    }
    if (url.pathname === '/auth/v1/token' && req.method === 'POST') {
      const grant = url.searchParams.get('grant_type')
      if (grant === 'refresh_token') {
        const id = String(body?.refresh_token || '').replace(/^refresh-/, '')
        const u = users.get(id)
        if (!u)
          return json(res, 400, {
            error: 'invalid_grant',
            error_description: 'unknown refresh token',
          })
        return json(res, 200, session(u))
      }
      return json(res, 400, { error: 'unsupported_grant_type' })
    }
    if (url.pathname === '/auth/v1/logout' && req.method === 'POST') return json(res, 204)
    if (url.pathname === '/auth/v1/authorize' && req.method === 'GET') {
      // OAuth stand-in: sign the caller in as a Google user straight away.
      const redirect = url.searchParams.get('redirect_to') || 'http://localhost:4173/'
      const u = await findOrCreateUser(db, 'google-user@example.com', {
        full_name: 'Googler Jones',
      })
      const s = session(u)
      const hash = new URLSearchParams({
        access_token: s.access_token,
        refresh_token: s.refresh_token,
        expires_in: '3600',
        token_type: 'bearer',
        type: 'oauth',
        provider_token: 'x',
      })
      res.writeHead(302, { Location: `${redirect}#${hash}`, ...cors() })
      return res.end()
    }

    // PostgREST subset.
    const rpcMatch = url.pathname.match(/^\/rest\/v1\/rpc\/([a-z_][a-z0-9_]*)$/)
    if (rpcMatch && req.method === 'POST')
      return json(res, 200, await rpc(db, req, rpcMatch[1], body))
    const tableMatch = url.pathname.match(/^\/rest\/v1\/([a-z_][a-z0-9_]*)$/)
    if (tableMatch) {
      const out = await restQuery(db, req, url, tableMatch[1], body)
      if (out.single) {
        if (out.rows.length !== 1) {
          return json(res, 406, {
            code: 'PGRST116',
            details: `The result contains ${out.rows.length} rows`,
            hint: null,
            message: 'JSON object requested, multiple (or no) rows returned',
          })
        }
        return json(res, 200, out.rows[0])
      }
      if (req.method !== 'GET' && !out.wantRows) return json(res, 204)
      return json(res, req.method === 'POST' ? 201 : 200, out.rows, {
        'Content-Range': `0-${Math.max(out.rows.length - 1, 0)}/*`,
      })
    }
    return json(res, 404, { message: `no route for ${req.method} ${url.pathname}` })
  } catch (err) {
    const status = err.status || (err.code === '42501' ? 403 : err.code ? 400 : 500)
    return json(res, status, {
      code: err.code || null,
      message: err.message,
      details: err.detail || null,
      hint: err.hint || null,
      ...(err.extra || {}),
    })
  }
})

server.listen(PORT, () =>
  console.log(`fake supabase on http://localhost:${PORT} (database: ${!!db})`),
)

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    server.close()
    if (db) await db.close().catch(() => {})
    process.exit(0)
  })
}
export { randomUUID }
