import { GoogleGenAI } from '@google/genai'
import { getGeminiApiKeys } from '../utils/geminiKeys'
import { assertGeminiApiKey, isGeminiQuotaError, toUserFacingGeminiError } from '../utils/geminiErrors'

/**
 * Run a Gemini call; on 429 quota, automatically try the next API key.
 * Keys must be from different Google Cloud projects to get separate free quotas.
 */
export async function withGeminiRetry<T>(
  fn: (ai: GoogleGenAI) => Promise<T>,
  language: 'id' | 'en' = 'id'
): Promise<T> {
  assertGeminiApiKey()
  const keys = getGeminiApiKeys()
  let lastErr: unknown

  for (let i = 0; i < keys.length; i++) {
    const ai = new GoogleGenAI({ apiKey: keys[i] })
    try {
      return await fn(ai)
    } catch (err) {
      lastErr = err
      const hasBackup = i < keys.length - 1
      if (isGeminiQuotaError(err) && hasBackup) {
        console.warn(`Gemini key #${i + 1} quota exhausted, trying backup key...`)
        continue
      }
      throw new Error(toUserFacingGeminiError(err, language), { cause: err })
    }
  }

  throw new Error(toUserFacingGeminiError(lastErr, language), { cause: lastErr })
}
