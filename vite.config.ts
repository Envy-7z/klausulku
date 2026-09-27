import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function validateGeminiKeyOnBuild(envKey: string | undefined) {
  return {
    name: 'validate-gemini-key',
    buildStart() {
      if (!envKey?.trim()) {
        throw new Error(
          'VITE_GEMINI_API_KEY is required for production build. ' +
            'Set it in .env or pass --build-arg VITE_GEMINI_API_KEY when building Docker.'
        )
      }
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const geminiKey = process.env.VITE_GEMINI_API_KEY ?? env.VITE_GEMINI_API_KEY

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(command === 'build' ? [validateGeminiKeyOnBuild(geminiKey)] : []),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/firebase')) return 'firebase'
            if (id.includes('node_modules/@google/genai')) return 'genai'
            if (id.includes('node_modules/html2pdf') || id.includes('node_modules/jspdf')) {
              return 'pdf'
            }
          },
        },
      },
    },
  }
})
