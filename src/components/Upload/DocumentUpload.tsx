import { useRef, useState, useCallback } from 'react'
import { AlertCircle, FileText, Loader2, Upload } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DocumentUploadProps {
  onFileSelected: (file: File) => void
  isLoading: boolean
}

const ACCEPTED = '.pdf,image/jpeg,image/png,image/webp'
const MAX_MB = 20

export default function DocumentUpload({ onFileSelected, isLoading }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const handleFile = useCallback(
    (file: File) => {
      setError('')
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`File terlalu besar. Maksimum ${MAX_MB}MB.`)
        return
      }
      const ok = file.type === 'application/pdf' || file.type.startsWith('image/')
      if (!ok) {
        setError('Format tidak didukung. Gunakan PDF atau gambar (JPG, PNG, WebP).')
        return
      }
      onFileSelected(file)
    },
    [onFileSelected]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="animate-fade-up w-full">
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'group relative cursor-pointer rounded-2xl border-2 border-dashed bg-white p-10 text-center transition-all sm:p-14 dark:bg-slate-900',
          dragging
            ? 'border-brand-500 bg-brand-50/50 shadow-lg shadow-brand-100/50 dark:bg-brand-950/30 dark:shadow-brand-900/20'
            : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 dark:border-slate-700 dark:hover:border-brand-600 dark:hover:bg-brand-950/20',
          isLoading && 'pointer-events-none opacity-80'
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !isLoading && inputRef.current?.click()}
        id="upload-zone"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          onChange={onInputChange}
          className="hidden"
          id="file-input"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Sedang menganalisis dokumen...</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ini mungkin butuh 15–30 detik</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors',
                dragging ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100'
              )}
            >
              {dragging ? <Upload className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {dragging ? 'Lepaskan file di sini' : 'Upload Dokumen Kontrak'}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Drag & drop PDF atau foto kontrak, atau{' '}
                <span className="font-semibold text-brand-600">pilih file</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['PDF', 'JPG', 'PNG', 'WebP'].map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  {t}
                </span>
              ))}
              <span className="text-xs text-slate-400">maks. {MAX_MB}MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
