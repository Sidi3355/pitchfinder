// Date and time formatting for the UK.

export function formatWhen(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Time not set'
  const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${day}, ${time}`
}

export function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Local date input value (YYYY-MM-DD) and time (HH:MM) for a Date. */
export function toInputParts(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  }
}

/** ISO string for a local date input + time input. */
export function fromInputParts(date, time) {
  const d = new Date(`${date}T${time || '19:00'}:00`)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

/** The next Thursday at 19:00 (or today at 19:00 if it is Thursday before 18:00). */
export function nextKickoff(now = new Date()) {
  const d = new Date(now)
  const day = d.getDay() // 0 Sun .. 4 Thu
  let ahead = (4 - day + 7) % 7
  if (ahead === 0 && d.getHours() >= 18) ahead = 7
  d.setDate(d.getDate() + ahead)
  d.setHours(19, 0, 0, 0)
  return d
}

/** "Today", "Tomorrow", "This Thursday", "Next Thursday", "In 3 weeks", "Happened". */
export function relativeDay(iso, now = new Date()) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const days = Math.round((startOf(d) - startOf(now)) / 86400e3)
  if (d.getTime() < now.getTime() - 3 * 3600e3) return 'Happened'
  if (days <= 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' })
  if (days < 7) return `This ${weekday}`
  if (days < 14) return `Next ${weekday}`
  return `In ${Math.round(days / 7)} weeks`
}
