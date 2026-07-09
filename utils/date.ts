/** Local (not UTC) YYYY-MM-DD for "today" — avoids day-shift bugs from toISOString(). */
export function todayISO(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Formats an ISO date (YYYY-MM-DD) as a short "DD.MM" label for chart axes. */
export function formatShortDate(iso: string): string {
  const [, month, day] = iso.split('-')
  return `${day}.${month}`
}

function isoToUTCDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function utcDateToISO(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Monday (ISO date) of the calendar week containing the given ISO date —
 * mirrors the backend's `_monday_of`, so "this week" always means the same
 * thing on both sides. Pure UTC-anchored math, no local-timezone drift. */
export function mondayOfWeek(iso: string): string {
  const date = isoToUTCDate(iso)
  const day = date.getUTCDay() // 0=Sun, 1=Mon, ... 6=Sat
  const diff = day === 0 ? 6 : day - 1 // days since Monday
  date.setUTCDate(date.getUTCDate() - diff)
  return utcDateToISO(date)
}

/** Adds (or subtracts, if negative) whole days to an ISO date. */
export function addDaysISO(iso: string, days: number): string {
  const date = isoToUTCDate(iso)
  date.setUTCDate(date.getUTCDate() + days)
  return utcDateToISO(date)
}
