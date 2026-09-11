// Share a URL: the native share sheet where there is one (phones), otherwise
// the clipboard. Returns 'shared' | 'copied' | 'failed'.

export async function shareUrl({ title, url, text }) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, url, text })
      return 'shared'
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled'
      // Unsupported payload: fall through to copying.
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    return 'failed'
  }
}
