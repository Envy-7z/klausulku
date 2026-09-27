import { assertAnyGeminiApiKey } from './geminiKeys'

type Lang = 'id' | 'en'

interface GoogleRpcError {
  code?: number
  message?: string
  status?: string
  details?: Array<{ reason?: string; '@type'?: string }>
}

export function extractGoogleError(err: unknown): GoogleRpcError | null {
  const raw = err instanceof Error ? err.message : String(err)

  const candidates = [raw]
  const jsonMatch = raw.match(/\{[\s\S]*"error"[\s\S]*\}/)
  if (jsonMatch) candidates.push(jsonMatch[0])

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as { error?: GoogleRpcError }
      if (parsed.error) return parsed.error
    } catch {
      /* not JSON */
    }
  }

  if (typeof err === 'object' && err !== null && 'error' in err) {
    return (err as { error: GoogleRpcError }).error
  }

  return null
}

function getBlockReason(error: GoogleRpcError): string | undefined {
  return error.details?.find((d) => d.reason)?.reason
}

/** True when another API key (different project) might still have quota. */
export function isGeminiQuotaError(err: unknown): boolean {
  const googleError = extractGoogleError(err)
  if (!googleError) return false
  return googleError.code === 429 || googleError.status === 'RESOURCE_EXHAUSTED'
}

export function toUserFacingGeminiError(err: unknown, lang: Lang = 'id'): string {
  const googleError = extractGoogleError(err)

  if (googleError) {
    const reason = getBlockReason(googleError)

    if (reason === 'API_KEY_SERVICE_BLOCKED' || googleError.code === 403) {
      return lang === 'id'
        ? 'API key Gemini diblokir atau belum diaktifkan. Periksa Google AI Studio dan aktifkan Generative Language API.'
        : 'Gemini API key is blocked or not enabled. Check Google AI Studio and enable the Generative Language API.'
    }

    if (googleError.code === 429 || googleError.status === 'RESOURCE_EXHAUSTED') {
      return lang === 'id'
        ? 'Kuota Gemini habis untuk semua API key. Tunggu beberapa menit, atau tambah backup key dari akun Google lain di .env (VITE_GEMINI_API_KEY_BACKUP).'
        : 'Gemini quota exceeded on all API keys. Wait a few minutes, or add a backup key from another Google account via VITE_GEMINI_API_KEY_BACKUP.'
    }

    if (googleError.code === 404) {
      return lang === 'id'
        ? 'Model AI tidak ditemukan. Perbarui konfigurasi model di aplikasi.'
        : 'AI model not found. Update the model configuration in the app.'
    }

    if (googleError.message) {
      return googleError.message
    }
  }

  const raw = err instanceof Error ? err.message : String(err)

  if (!raw || raw === '[object Object]') {
    return lang === 'id'
      ? 'Terjadi kesalahan saat menghubungi AI. Coba lagi.'
      : 'An error occurred while contacting AI. Please try again.'
  }

  if (raw.length > 280) {
    return lang === 'id'
      ? 'Terjadi kesalahan saat analisis dokumen. Coba lagi.'
      : 'An error occurred during document analysis. Please try again.'
  }

  return raw
}

export function assertGeminiApiKey(): void {
  assertAnyGeminiApiKey()
}
