import { describe, expect, it } from 'vitest'
import { addDaysISO, formatShortDate, mondayOfWeek, todayISO } from './date'

describe('todayISO', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('formatShortDate', () => {
  it('formats an ISO date as DD.MM', () => {
    expect(formatShortDate('2026-07-02')).toBe('02.07')
    expect(formatShortDate('2026-01-31')).toBe('31.01')
  })
})

describe('mondayOfWeek', () => {
  it('returns the same date when given a Monday', () => {
    expect(mondayOfWeek('2026-07-06')).toBe('2026-07-06') // a Monday
  })

  it('returns the preceding Monday for any other weekday', () => {
    expect(mondayOfWeek('2026-07-07')).toBe('2026-07-06') // Tuesday
    expect(mondayOfWeek('2026-07-12')).toBe('2026-07-06') // Sunday
  })

  it('handles month/year boundaries', () => {
    expect(mondayOfWeek('2026-01-01')).toBe('2025-12-29') // Thursday
  })
})

describe('addDaysISO', () => {
  it('adds and subtracts days across month boundaries', () => {
    expect(addDaysISO('2026-07-06', 6)).toBe('2026-07-12')
    expect(addDaysISO('2026-07-01', -1)).toBe('2026-06-30')
  })
})
