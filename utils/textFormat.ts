export interface TextSegment {
  link: boolean
  value: string
}

/**
 * Splits free-text (e.g. a supplement's "sources" field) into lines, and each
 * line into plain-text/link segments. Used to render URLs as clickable links
 * without ever needing v-html (which would let backend-editable text inject
 * arbitrary HTML into the page).
 */
export function parseSourceLines(text: string | null | undefined): TextSegment[][] {
  if (!text) return []
  return text.split('\n').map((line) => {
    const parts: TextSegment[] = []
    const urlRegex = /(https?:\/\/[^\s]+)/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = urlRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ link: false, value: line.slice(lastIndex, match.index) })
      }
      parts.push({ link: true, value: match[0] })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < line.length) {
      parts.push({ link: false, value: line.slice(lastIndex) })
    }
    return parts
  })
}
