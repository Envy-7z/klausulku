/** Collect unique Gemini API keys — primary + optional backups (comma-separated). */
export function getGeminiApiKeys(): string[] {
  const fromList = import.meta.env.VITE_GEMINI_API_KEYS as string | undefined
  if (fromList?.trim()) {
    return dedupe(fromList.split(',').map((k) => k.trim()).filter(Boolean))
  }

  const primary = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  const backup = import.meta.env.VITE_GEMINI_API_KEY_BACKUP as string | undefined

  return dedupe(
    [primary?.trim(), ...(backup?.split(',').map((k) => k.trim()) ?? [])].filter(
      (k): k is string => Boolean(k)
    )
  )
}

function dedupe(keys: string[]): string[] {
  return [...new Set(keys)]
}

export function assertAnyGeminiApiKey(): void {
  if (getGeminiApiKeys().length === 0) {
    throw new Error(
      'VITE_GEMINI_API_KEY belum dikonfigurasi. Tambahkan ke .env lalu restart dev server.'
    )
  }
}
