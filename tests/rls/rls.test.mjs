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

d('shared groups', () => {
  let slug
  let otherSlug
  const priya = 'guestkey-priya-0123456789abcdef'
  const join = (who, args) =>
    who((q) =>
      q('select group_join($1, $2, $3, $4, $5, $6, $7, $8) as id', [
        args.slug ?? slug,
        args.name,
        args.label ?? '',
        args.lat ?? 51.5,
        args.lng ?? -0.1,
        args.mode ?? 'transit',
        JSON.stringify(args.prefs ?? {}),
        args.key ?? null,
      ]),
    )
  const read = (who, key = null, s = slug) =>
    who((q) => q('select group_by_slug($1, $2) as g', [s, key])).then((r) => r.rows[0].g)

  it('every group has an unguessable link', async () => {
    const { rows } = await db.asUser(alice, (q) =>
      q(`insert into groups (owner_id, name) values ($1, $2) returning share_slug`, [
        alice,
        'Thursday lot',
      ]),
    )
    slug = rows[0].share_slug
    expect(slug).toMatch(/^[0-9a-f]{20}$/)
    const other = await db.asUser(bob, (q) =>
      q(`insert into groups (owner_id, name) values ($1, $2) returning share_slug`, [
        bob,
        'Sunday lot',
      ]),
    )
    otherSlug = other.rows[0].share_slug
  })
  it('anyone with the link reads the group, and an unknown link reads nothing', async () => {
    const g = await read(db.asAnon)
    expect(g.group.name).toBe('Thursday lot')
    expect(g.group.owner_name).toBe('Alice')
    expect(g.group.is_owner).toBe(false)
    expect(g.group.owner_id).toBeUndefined()
    expect(g.members).toEqual([])
    const none = await db.asAnon((q) => q('select group_by_slug($1) as g', ['nope']))
    expect(none.rows[0].g).toBeNull()
  })
  it('a guest adds themselves with a key and can change their own entry', async () => {
    const first = await join(db.asAnon, { name: 'Priya', label: 'Peckham', key: priya })
    const second = await join(db.asAnon, {
      name: 'Priya',
      label: 'Brixton',
      lat: 51.46,
      lng: -0.11,
      mode: 'cycle',
      prefs: { budget: 8, lit: true },
      key: priya,
    })
    expect(first.rows[0].id).toBe(second.rows[0].id)
    const g = await read(db.asAnon, priya)
    expect(g.members).toEqual([
      expect.objectContaining({
        name: 'Priya',
        label: 'Brixton',
        mode: 'cycle',
        prefs: { budget: 8, lit: true },
        is_you: true,
      }),
    ])
    const stranger = await read(db.asAnon, 'guestkey-someone-else-0123456789')
    expect(stranger.members[0].is_you).toBe(false)
  })
  it('a signed-in person is keyed by their account, not a guest key', async () => {
    await join(db.asUser.bind(null, bob), { name: 'Bob', label: 'Hackney' })
    await join(db.asUser.bind(null, bob), { name: 'Bobby', label: 'Hackney', mode: 'walk' })
    const g = await read(db.asUser.bind(null, bob))
    expect(g.members.map((m) => [m.name, m.is_you])).toEqual([
      ['Priya', false],
      ['Bobby', true],
    ])
  })
  it('refuses a weak key, a bad mode and a place outside the UK', async () => {
    await expect(join(db.asAnon, { name: 'X', key: 'short' })).rejects.toThrow(/guest key/)
    await expect(join(db.asAnon, { name: 'X', key: priya, mode: 'teleport' })).rejects.toThrow(
      /invalid mode/,
    )
    await expect(join(db.asAnon, { name: 'X', key: priya, lat: 40.7, lng: -74 })).rejects.toThrow(
      /outside the UK/,
    )
    await expect(join(db.asAnon, { name: 'X', key: priya, slug: 'nope' })).rejects.toThrow(
      /group not found/,
    )
  })
  it('members are private to the link: the table is closed and other groups are separate', async () => {
    await expect(db.asAnon((q) => q('select name from group_members'))).rejects.toThrow(
      /permission denied/,
    )
    const bobs = await db.asUser(bob, (q) => q('select name from group_members'))
    expect(bobs.rows).toHaveLength(0) // Bob is a member, not the owner
    const other = await read(db.asAnon, priya, otherSlug)
    expect(other.members).toEqual([])
  })
  it('the owner sees members, lists the group with a count, and can remove someone', async () => {
    const mine = await db.asUser(alice, (q) => q('select name from group_members order by 1'))
    expect(mine.rows.map((r) => r.name)).toEqual(['Bobby', 'Priya'])
    const { rows } = await db.asUser(alice, (q) => q('select my_groups() as g'))
    const g = rows[0].g.find((x) => x.share_slug === slug)
    expect(g).toMatchObject({ name: 'Thursday lot', member_count: 2, members: ['Priya', 'Bobby'] })
    const bobList = await db.asUser(bob, (q) => q('select my_groups() as g'))
    expect(bobList.rows[0].g.map((x) => x.name)).toEqual(['Sunday lot'])
    const removed = await db.asUser(alice, (q) =>
      q(`delete from group_members where name = 'Bobby'`),
    )
    expect(removed.rowCount).toBe(1)
    const notOwner = await db.asUser(bob, (q) =>
      q(`delete from group_members where name = 'Priya'`),
    )
    expect(notOwner.rowCount).toBe(0)
  })
  it('a member can leave, and only their own row goes', async () => {
    await join(db.asUser.bind(null, bob), { name: 'Bob', label: 'Hackney' })
    await db.asAnon((q) =>
      q('select group_leave($1, $2)', [slug, 'guestkey-someone-else-0123456789']),
    )
    expect((await read(db.asAnon)).members).toHaveLength(2)
    await db.asAnon((q) => q('select group_leave($1, $2)', [slug, priya]))
    await db.asUser(bob, (q) => q('select group_leave($1)', [slug]))
    expect((await read(db.asAnon)).members).toEqual([])
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
  it('stores the group that picked the pitch and returns it with the game', async () => {
    const group = [{ name: 'Sam', label: 'E8 3DL', lat: 51.5475, lng: -0.0553, mode: 'transit' }]
    await db.asUser(alice, (q) =>
      q(`update games set "group" = $1 where id = $2`, [JSON.stringify(group), gameId]),
    )
    const { rows } = await db.asAnon((q) => q('select game_by_slug($1) as g', [slug]))
    expect(rows[0].g.game.group).toEqual(group)
    await expect(
      db.asUser(alice, (q) =>
        q(`update games set "group" = $1 where id = $2`, ['{"not":"an array"}', gameId]),
      ),
    ).rejects.toThrow(/check constraint/)
  })
  it('records a change of time so answers given before it can be flagged', async () => {
    const key = 'guestkey-timechange-0123456789'
    await db.asAnon((q) => q('select rsvp_guest($1, $2, $3, $4)', [slug, 'Early', key, 'in']))
    // Notes only: no time change is recorded.
    await db.asUser(alice, (q) => q(`update games set notes = 'bibs' where id = $1`, [gameId]))
    let { rows } = await db.asAnon((q) => q('select game_by_slug($1, $2) as g', [slug, key]))
    expect(rows[0].g.game.previous_starts_at).toBeNull()
    expect(rows[0].g.rsvps[0].before_change).toBe(false)
    // The time moves: the old time is kept and the earlier answer is flagged.
    const was = rows[0].g.game.starts_at
    await db.asUser(alice, (q) =>
      q(`update games set starts_at = starts_at + interval '30 minutes' where id = $1`, [gameId]),
    )
    ;({ rows } = await db.asAnon((q) => q('select game_by_slug($1, $2) as g', [slug, key])))
    expect(new Date(rows[0].g.game.previous_starts_at).toISOString()).toBe(
      new Date(was).toISOString(),
    )
    expect(rows[0].g.game.time_changed_at).toBeTruthy()
    expect(rows[0].g.rsvps.find((r) => r.name === 'Early').before_change).toBe(true)
    // Answering again clears the flag; the client cannot forge the record.
    await db.asAnon((q) => q('select rsvp_guest($1, $2, $3, $4)', [slug, 'Early', key, 'in']))
    await expect(
      db.asUser(alice, (q) => q(`update games set time_changed_at = null where id = $1`, [gameId])),
    ).resolves.toBeTruthy()
    ;({ rows } = await db.asAnon((q) => q('select game_by_slug($1, $2) as g', [slug, key])))
    expect(rows[0].g.game.time_changed_at).toBeTruthy()
    expect(rows[0].g.rsvps.find((r) => r.name === 'Early').before_change).toBe(false)
    await db.admin(`delete from rsvps where guest_key = $1`, [key])
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
