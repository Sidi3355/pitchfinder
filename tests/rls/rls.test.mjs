// @vitest-environment node
// Row-level security tests. They run against a real Postgres with the
// migrations applied (DATABASE_URL), never against the client. Each test
// proves an access rule the product depends on.

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestDatabase } from './harness.mjs'

const HAS_DB = !!process.env.DATABASE_URL
const d = describe.skipIf(!HAS_DB)

let db
let alice
let bob

beforeAll(async () => {
  if (!HAS_DB) return
  db = await createTestDatabase()
  alice = await db.createUser('alice@example.com')
  bob = await db.createUser('bob@example.com')
  await db.asUser(alice, (q) =>
    q('insert into profiles (id, display_name) values ($1, $2)', [alice, 'Alice']),
  )
  await db.asUser(bob, (q) =>
    q('insert into profiles (id, display_name) values ($1, $2)', [bob, 'Bob']),
  )
}, 30000)

afterAll(async () => {
  if (db) await db.close()
})

d('profiles', () => {
  it('cannot be created for someone else', async () => {
    await expect(
      db.asUser(alice, (q) =>
        q('insert into profiles (id, display_name) values ($1, $2)', [bob, 'Impostor']),
      ),
    ).rejects.toThrow(/row-level security|duplicate key/)
  })
  it('display names are readable by everyone, including anon', async () => {
    const { rows } = await db.asAnon((q) => q('select display_name from profiles order by 1'))
    expect(rows.map((r) => r.display_name)).toEqual(['Alice', 'Bob'])
  })
  it('cannot be updated by another user', async () => {
    const { rowCount } = await db.asUser(bob, (q) =>
      q('update profiles set display_name = $1 where id = $2', ['Hacked', alice]),
    )
    expect(rowCount).toBe(0)
  })
})

d('saved pitches', () => {
  it('are private to the user who saved them', async () => {
    await db.asUser(alice, (q) =>
      q('insert into saved_pitches (user_id, pitch_id) values ($1, $2)', [alice, 'pl-shoreditch']),
    )
    const mine = await db.asUser(alice, (q) => q('select pitch_id from saved_pitches'))
    expect(mine.rows).toHaveLength(1)
    const theirs = await db.asUser(bob, (q) => q('select pitch_id from saved_pitches'))
    expect(theirs.rows).toHaveLength(0)
    await expect(db.asAnon((q) => q('select pitch_id from saved_pitches'))).rejects.toThrow(
      /permission denied/,
    )
  })
  it('cannot be inserted on behalf of another user', async () => {
    await expect(
      db.asUser(bob, (q) =>
        q('insert into saved_pitches (user_id, pitch_id) values ($1, $2)', [alice, 'go-sutton']),
      ),
    ).rejects.toThrow(/row-level security/)
  })
  it('cannot be deleted by another user', async () => {
    const { rowCount } = await db.asUser(bob, (q) =>
      q('delete from saved_pitches where user_id = $1', [alice]),
    )
    expect(rowCount).toBe(0)
  })
})

d('groups', () => {
  let groupId
  it('are created by their owner', async () => {
    const { rows } = await db.asUser(alice, (q) =>
      q(`insert into groups (owner_id, name, members) values ($1, $2, $3) returning id`, [
        alice,
        'Thursday lot',
        JSON.stringify([{ name: 'Sam', lat: 51.5, lng: -0.1, mode: 'transit' }]),
      ]),
    )
    groupId = rows[0].id
    expect(groupId).toBeTruthy()
  })
  it('cannot be read, changed or deleted by another user', async () => {
    const read = await db.asUser(bob, (q) => q('select id from groups where id = $1', [groupId]))
    expect(read.rows).toHaveLength(0)
    const upd = await db.asUser(bob, (q) =>
      q('update groups set name = $1 where id = $2', ['Stolen', groupId]),
    )
    expect(upd.rowCount).toBe(0)
    const del = await db.asUser(bob, (q) => q('delete from groups where id = $1', [groupId]))
    expect(del.rowCount).toBe(0)
  })
  it('cannot be created for another owner', async () => {
    await expect(
      db.asUser(bob, (q) =>
        q('insert into groups (owner_id, name) values ($1, $2)', [alice, 'Not mine']),
      ),
    ).rejects.toThrow(/row-level security/)
  })
})

d('games and RSVPs', () => {
  let slug
  let gameId
  it('a signed-in user creates a game with an unguessable slug', async () => {
    const { rows } = await db.asUser(alice, (q) =>
      q(
        `insert into games (creator_id, pitch_id, pitch_name, starts_at, notes)
         values ($1, 'pl-shoreditch', 'Powerleague Shoreditch', now() + interval '2 days', 'Bring bibs')
         returning id, share_slug`,
        [alice],
      ),
    )
    slug = rows[0].share_slug
    gameId = rows[0].id
    expect(slug).toMatch(/^[0-9a-f]{20}$/)
  })
  it('anon cannot create a game and cannot list games', async () => {
    await expect(
      db.asAnon((q) =>
        q(
          `insert into games (creator_id, pitch_id, pitch_name, starts_at) values ($1, 'x', 'x', now())`,
          [alice],
        ),
      ),
    ).rejects.toThrow(/permission denied|row-level security/)
    await expect(db.asAnon((q) => q('select id from games'))).rejects.toThrow(/permission denied/)
  })
  it('another signed-in user cannot see or edit the game directly', async () => {
    const read = await db.asUser(bob, (q) => q('select id from games'))
    expect(read.rows).toHaveLength(0)
    const upd = await db.asUser(bob, (q) =>
      q(`update games set notes = 'Changed' where id = $1`, [gameId]),
    )
    expect(upd.rowCount).toBe(0)
    const del = await db.asUser(bob, (q) => q('delete from games where id = $1', [gameId]))
    expect(del.rowCount).toBe(0)
  })
  it('anyone with the link reads the game through game_by_slug', async () => {
    const { rows } = await db.asAnon((q) => q('select game_by_slug($1) as g', [slug]))
    const g = rows[0].g
    expect(g.game.pitch_name).toBe('Powerleague Shoreditch')
    expect(g.game.creator_name).toBe('Alice')
    expect(g.game.is_creator).toBe(false)
    expect(g.rsvps).toEqual([])
    expect(g.game.creator_id).toBeUndefined()
  })
  it('an unknown slug returns nothing', async () => {
    const { rows } = await db.asAnon((q) => q('select game_by_slug($1) as g', ['nope']))
    expect(rows[0].g).toBeNull()
  })
  it('a guest RSVPs with a name and key, and can change their answer', async () => {
    const key = 'guestkey-0123456789abcdef'
    const first = await db.asAnon((q) =>
      q('select rsvp_guest($1, $2, $3, $4) as id', [slug, 'Priya', key, 'in']),
    )
    const second = await db.asAnon((q) =>
      q('select rsvp_guest($1, $2, $3, $4) as id', [slug, 'Priya', key, 'maybe']),
    )
    expect(first.rows[0].id).toBe(second.rows[0].id)
    const { rows } = await db.asAnon((q) => q('select game_by_slug($1, $2) as g', [slug, key]))
    expect(rows[0].g.rsvps).toEqual([
      expect.objectContaining({ name: 'Priya', status: 'maybe', is_you: true }),
    ])
  })
  it('a guest cannot RSVP with a weak key or a bad status', async () => {
    await expect(
      db.asAnon((q) => q('select rsvp_guest($1, $2, $3, $4)', [slug, 'X', 'short', 'in'])),
    ).rejects.toThrow(/guest key/)
    await expect(
      db.asAnon((q) =>
        q('select rsvp_guest($1, $2, $3, $4)', [slug, 'X', 'guestkey-0123456789abcdef', 'yes']),
      ),
    ).rejects.toThrow(/status/)
  })
  it('a signed-in user RSVPs under their profile', async () => {
    await db.asUser(bob, (q) => q('select rsvp_user($1, $2)', [slug, 'in']))
    const { rows } = await db.asUser(alice, (q) => q('select game_by_slug($1) as g', [slug]))
    const names = rows[0].g.rsvps.map((r) => [r.name, r.status])
    expect(names).toEqual([
      ['Priya', 'maybe'],
      ['Bob', 'in'],
    ])
    expect(rows[0].g.game.is_creator).toBe(true)
  })
  it('a user cannot change or delete another RSVP directly', async () => {
    const upd = await db.asUser(bob, (q) =>
      q(`update rsvps set status = 'out' where user_id is null`),
    )
    expect(upd.rowCount).toBe(0)
    const del = await db.asUser(bob, (q) => q(`delete from rsvps where user_id is null`))
    expect(del.rowCount).toBe(0)
    await expect(db.asAnon((q) => q('select id from rsvps'))).rejects.toThrow(/permission denied/)
  })
  it('the creator can remove any RSVP and cancel the game, after which RSVPs are refused', async () => {
    const del = await db.asUser(alice, (q) => q(`delete from rsvps where user_id is null`))
    expect(del.rowCount).toBe(1)
    const upd = await db.asUser(alice, (q) =>
      q(`update games set status = 'cancelled' where id = $1`, [gameId]),
    )
    expect(upd.rowCount).toBe(1)
    await expect(
      db.asAnon((q) =>
        q('select rsvp_guest($1, $2, $3, $4)', [slug, 'Late', 'guestkey-abcdefabcdefabcdef', 'in']),
      ),
    ).rejects.toThrow(/cancelled/)
  })
})

d('reports', () => {
  it('anyone can file a report but nobody can read them through the API', async () => {
    await db.asAnon((q) =>
      q(
        `insert into reports (pitch_id, field, suggested_value, message) values ('pl-shoreditch', 'price', '£80', 'Went up in September')`,
      ),
    )
    await db.asUser(bob, (q) =>
      q(
        `insert into reports (pitch_id, field, message, user_id) values ('pl-shoreditch', 'lit', 'No lights', $1)`,
        [bob],
      ),
    )
    await expect(
      db.asUser(bob, (q) =>
        q(`insert into reports (pitch_id, field, user_id) values ('x', 'lit', $1)`, [alice]),
      ),
    ).rejects.toThrow(/row-level security/)
    await expect(db.asAnon((q) => q('select id from reports'))).rejects.toThrow(/permission denied/)
    await expect(db.asUser(bob, (q) => q('select id from reports'))).rejects.toThrow(
      /permission denied/,
    )
    const { rows } = await db.admin('select count(*)::int as n from reports')
    expect(rows[0].n).toBe(2)
  })
})
