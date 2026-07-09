import { describe, expect, it } from 'vitest'
import { parseSourceLines } from './textFormat'

describe('parseSourceLines', () => {
  it('returns an empty array for empty/nullish input', () => {
    expect(parseSourceLines('')).toEqual([])
    expect(parseSourceLines(null)).toEqual([])
    expect(parseSourceLines(undefined)).toEqual([])
  })

  it('splits multi-line text into one segment array per line', () => {
    const result = parseSourceLines('line one\nline two')
    expect(result).toEqual([
      [{ link: false, value: 'line one' }],
      [{ link: false, value: 'line two' }],
    ])
  })

  it('extracts URLs as separate link segments', () => {
    const result = parseSourceLines('See https://example.com/study for details')
    expect(result).toEqual([
      [
        { link: false, value: 'See ' },
        { link: true, value: 'https://example.com/study' },
        { link: false, value: ' for details' },
      ],
    ])
  })

  it('never produces raw HTML — plain text stays as literal segment values', () => {
    const malicious = '<img src=x onerror=alert(1)>'
    const result = parseSourceLines(malicious)
    expect(result).toEqual([[{ link: false, value: malicious }]])
  })
})
