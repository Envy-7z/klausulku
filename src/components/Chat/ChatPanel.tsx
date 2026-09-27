import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowUp, Scale, X } from 'lucide-react'
import type { AnalysisResult, ChatMessage } from '../../types'
import { sendChatMessage } from '../../services/gemini'
import { updateChatHistory } from '../../services/db'
import { escapeHtml } from '../../utils/escapeHtml'
import { toUserFacingGeminiError } from '../../utils/geminiErrors'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

interface ChatPanelProps {
  analysis: AnalysisResult
  isOpen: boolean
  onClose: () => void
  language?: 'id' | 'en'
  initialMessages?: ChatMessage[]
  userId?: string | null
  seedPrompt?: string | null
  onSeedConsumed?: () => void
}

const SUGGESTIONS_ID = [
  'Apa risiko terbesar di kontrak ini?',
  'Klausul mana yang paling merugikan saya?',
  'Gimana cara negosiasi klausul ini?',
  'Tolong jelaskan istilah hukum yang ada',
]

const SUGGESTIONS_EN = [
  'What is the biggest risk in this contract?',
  'Which clause is most detrimental to me?',
  'How do I negotiate this clause?',
  'Please explain the legal terms',
]

function buildWelcomeMessage(analysis: AnalysisResult, language: 'id' | 'en'): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    content:
      language === 'id'
        ? `Halo! Saya sudah membaca dokumen **${analysis.filename}** (${analysis.clauses.length} klausul). Risiko keseluruhan: **${analysis.overallRisk}**.\n\nSilakan tanya apapun tentang kontrak ini — saya siap membantu!`
        : `Hello! I have read the document **${analysis.filename}** (${analysis.clauses.length} clauses). Overall risk: **${analysis.overallRisk}**.\n\nPlease ask anything about this contract — I'm ready to help!`,
    timestamp: 0,
  }
}

export default function ChatPanel({
  analysis,
  isOpen,
  onClose,
  language = 'id',
  initialMessages,
  userId,
  seedPrompt,
  onSeedConsumed,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialMessages && initialMessages.length > 0
      ? initialMessages
      : [buildWelcomeMessage(analysis, language)]
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const lastSeedRef = useRef<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, messages])

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      }
      const historyForApi = [...messages, userMsg]
      setMessages(historyForApi)
      setInput('')
      setLoading(true)

      try {
        const aiText = await sendChatMessage(text.trim(), analysis, messages, language)
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: aiText,
          timestamp: Date.now(),
        }
        const fullHistory = [...historyForApi, assistantMsg]
        setMessages(fullHistory)

        if (userId) {
          updateChatHistory(analysis.documentId, fullHistory).catch((err) =>
            console.error('Gagal menyimpan chat history', err)
          )
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: toUserFacingGeminiError(err, language),
            timestamp: Date.now(),
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [loading, messages, analysis, language, userId]
  )

  useEffect(() => {
    if (!isOpen || !seedPrompt || loading) return
    if (lastSeedRef.current === seedPrompt) return
    lastSeedRef.current = seedPrompt
    void send(seedPrompt)
    onSeedConsumed?.()
  }, [isOpen, seedPrompt, loading, send, onSeedConsumed])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  if (!isOpen) return null

  const suggestions = language === 'id' ? SUGGESTIONS_ID : SUGGESTIONS_EN

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        onClick={onClose}
        aria-label="Tutup chat"
      />

      <div
        className={cn(
          'flex min-h-0 flex-col border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
          'fixed inset-y-0 right-0 z-50 w-full max-w-md border-l shadow-2xl',
          'lg:static lg:max-h-[calc(100vh-4rem)] lg:w-[min(420px,32vw)] lg:max-w-none lg:shrink-0 lg:shadow-none lg:sticky lg:top-16 lg:self-start'
        )}
        id="chat-panel"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">KlausulKu AI</p>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online · Paham isi kontrakmu
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} id="close-chat-btn" aria-label="Tutup chat">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-2.5', msg.role === 'user' && 'flex-row-reverse')}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                  <Scale className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-brand-600 text-white'
                    : 'rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                )}
              >
                <FormattedMessage content={msg.content} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <Scale className="h-3.5 w-3.5" />
              </div>
              <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 dark:bg-slate-800">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="shrink-0 flex flex-wrap gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-800">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300"
                onClick={() => send(s)}
                id={`suggestion-${i}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 dark:border-slate-700 dark:bg-slate-800/50 dark:focus-within:border-brand-600 dark:focus-within:ring-brand-900">
            <textarea
              ref={inputRef}
              className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder={
                language === 'id' ? 'Tanya tentang kontrak ini...' : 'Ask about this contract...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              id="chat-input"
              disabled={loading}
            />
            <Button
              size="icon"
              className={cn('shrink-0 rounded-lg', !input.trim() && 'opacity-50')}
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              id="chat-send-btn"
              aria-label="Kirim"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

function FormattedMessage({ content }: { content: string }) {
  const html = escapeHtml(content)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
