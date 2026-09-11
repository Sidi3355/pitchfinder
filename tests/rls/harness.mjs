// Applies the migrations to a throwaway database on a local Postgres and
// gives tests a way to run SQL as anon, as a signed-in user, or as the
// service role, the way PostgREST does (role switch + request.jwt.claims).
// Needs DATABASE_URL pointing at a superuser connection; tests skip without it.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'

const MIGRATIONS = join(process.cwd(), 'supabase/migrations')

// What a fresh Supabase project already has: the auth schema, auth.uid(),
// and the API roles. Kept minimal on purpose.
const SUPABASE_STUB = `
  create schema if not exists auth;
  create table if not exists auth.users (id uuid primary key, email text);
  create or replace function auth.uid() returns uuid language sql stable as $$
    select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid
  $$;
  create or replace function auth.role() returns text language sql stable as $$
    select nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'
  $$;
  do $$ begin
    if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  end $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
  grant execute on function auth.role() to anon, authenticated;
`

export async function createTestDatabase() {
  const adminUrl = process.env.DATABASE_URL
  if (!adminUrl) throw new Error('DATABASE_URL is not set')
  const name = `pf_rls_${Date.now()}`
  const admin = new pg.Client({ connectionString: adminUrl })
  await admin.connect()
  await admin.query(`create database ${name}`)
  await admin.end()

  const url = new URL(adminUrl)
  url.pathname = `/${name}`
  const client = new pg.Client({ connectionString: url.toString() })
  await client.connect()
  await client.query(SUPABASE_STUB)
  for (const file of readdirSync(MIGRATIONS)
    .filter((f) => f.endsWith('.sql'))
    .sort()) {
    await client.query(readFileSync(join(MIGRATIONS, file), 'utf8'))
  }

  // One connection, so calls are serialised: each runs in its own
  // transaction, the way PostgREST scopes a request.
  let chain = Promise.resolve()
  function asUser(userId, fn) {
    const run = () => runAs(userId, fn)
    const next = chain.then(run, run)
    chain = next.catch(() => {})
    return next
  }

  async function runAs(userId, fn) {
    await client.query('begin')
    try {
      const claims = userId ? { sub: userId, role: 'authenticated' } : { role: 'anon' }
      await client.query(`select set_config('request.jwt.claims', $1, true)`, [
        JSON.stringify(claims),
      ])
      await client.query(`set local role ${userId ? 'authenticated' : 'anon'}`)
      const result = await fn((text, params) => client.query(text, params))
      await client.query('commit')
      return result
    } catch (err) {
      await client.query('rollback')
      throw err
    }
  }

  return {
    /** Run SQL as the superuser (like the service role). */
    admin: (text, params) => client.query(text, params),
    /** Run a function's queries as an anonymous API caller. */
    asAnon: (fn) => asUser(null, fn),
    /** Run a function's queries as the signed-in user with this id. */
    asUser,
    async createUser(email) {
      const { rows } = await client.query(
        'insert into auth.users (id, email) values (gen_random_uuid(), $1) returning id',
        [email],
      )
      return rows[0].id
    },
    async close() {
      await client.end()
      const admin2 = new pg.Client({ connectionString: adminUrl })
      await admin2.connect()
      await admin2.query(`drop database ${name}`)
      await admin2.end()
    },
  }
}
