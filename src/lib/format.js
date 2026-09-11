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
