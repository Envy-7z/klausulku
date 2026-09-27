import {
  ArrowRight,
  BookOpen,
  Cloud,
  FileSearch,
  Flame,
  MessageSquare,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Upload,
  Users,
  Zap,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import RiskBadge from '../components/common/RiskBadge'
import { cn } from '../lib/utils'

interface LandingPageProps {
  onStart: () => void
}

const features = [
  {
    icon: Upload,
    title: 'Upload Dokumen',
    desc: 'Upload PDF atau foto kontrak. AI langsung membaca dan memahami isi dokumen Anda.',
  },
  {
    icon: Shield,
    title: 'Verdict AI',
    desc: 'Keputusan jelas: aman ditandatangani, negosiasi dulu, atau jangan tanda tangan tanpa bantuan.',
  },
  {
    icon: Zap,
    title: 'Action Plan',
    desc: 'Langkah konkret setelah analisis — bukan cuma info, tapi panduan apa yang harus dilakukan UMKM.',
  },
  {
    icon: MessageSquare,
    title: 'Generator Negosiasi',
    desc: 'Draft pesan WhatsApp, email, atau addendum otomatis untuk negosiasi klausul berisiko.',
  },
  {
    icon: BookOpen,
    title: 'Playbook Kontrak',
    desc: 'Checklist per tipe kontrak (sewa, MOU, franchise) — cocokkan dengan dokumen Anda.',
  },
  {
    icon: FileSearch,
    title: 'Skor UMKM-Friendliness',
    desc: 'Ukur seberapa adil kontrak dibanding standar pasar UMKM Indonesia.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    desc: 'Akses dari HP, tablet, atau komputer. Semua fitur lengkap di semua perangkat.',
  },
]

const steps = [
  { num: '01', title: 'Upload Kontrak', desc: 'Drag & drop PDF atau foto dokumen hukummu' },
  { num: '02', title: 'AI Menganalisis', desc: 'Gemini AI baca, scoring, dan deteksi tipe kontrak' },
  { num: '03', title: 'Lihat Verdict', desc: 'Keputusan jelas + heatmap + skor UMKM-friendliness' },
  { num: '04', title: 'Ambil Tindakan', desc: 'Action plan, negosiasi otomatis, dan chat AI terpandu' },
]

const problems = [
  {
    icon: Users,
    label: 'Pain Point',
    title: 'Kontrak ditandatangani tanpa dipahami',
    desc: 'Banyak pelaku UMKM menandatangani kontrak sewa, MOU, atau franchise tanpa memahami klausul berisiko.',
    accent: 'red' as const,
  },
  {
    icon: Flame,
    label: 'Pain Point',
    title: 'Konsultasi hukum mahal & lambat',
    desc: 'Review kontrak oleh pengacara sering tidak terjangkau dan butuh waktu untuk UMKM dengan budget terbatas.',
    accent: 'red' as const,
  },
  {
    icon: Target,
    label: 'Solusi KlausulKu',
    title: 'Analisis instan + action plan',
    desc: 'Upload dokumen, dapat verdict (tanda tangan/negosiasi/hati-hati), langkah konkret, dan draft negosiasi otomatis.',
    accent: 'brand' as const,
  },
]

const techStack = [
  { name: 'Gemini 2.5 Flash', role: 'Analisis klausul & chat kontekstual' },
  { name: 'Firebase', role: 'Google Sign-In & riwayat dokumen' },
  { name: 'Cloud Run', role: 'Deploy serverless, siap production' },
  { name: 'Vite + React', role: 'Frontend cepat & responsif' },
]

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <main className="mesh-bg flex-1">
      {/* Hero — 2-col on xl */}
      <section className="section-anchor relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16 xl:pt-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-900/20" />
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl dark:bg-indigo-900/10" />

        <div className="container-app relative">
          <div className="grid items-center gap-12 xl:grid-cols-2 xl:gap-16">
            <div className="mx-auto max-w-xl text-center xl:mx-0 xl:text-left">
              <div className="section-label animate-fade-up mb-6 xl:mx-0 mx-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse-dot" />
                #JuaraVibeCoding · AI Legal untuk UMKM
              </div>

              <h1 className="animate-fade-up-delay-1 text-balance text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl xl:text-5xl 2xl:text-6xl">
                Pahami Kontrakmu{' '}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                  dalam Hitungan Detik
                </span>
              </h1>

              <p className="animate-fade-up-delay-2 mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                KlausulKu menerjemahkan bahasa hukum yang rumit menjadi insight bisnis yang mudah
                dipahami — khusus untuk pelaku UMKM Indonesia.
              </p>

              <div className="animate-fade-up-delay-3 mt-10 flex flex-col items-center gap-3 xl:items-start">
                <Button size="lg" onClick={onStart} id="hero-start-btn" className="shadow-md shadow-brand-600/20">
                  <Zap className="h-4 w-4" />
                  Analisis Kontrak Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Gratis · Tidak perlu daftar · Hasil instan
                </p>
              </div>
            </div>

            {/* Product preview */}
            <div className="animate-fade-up-delay-3 mx-auto w-full max-w-xl xl:max-w-none">
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Problem — JuaraVibeCoding criteria: Masalah (30%) */}
      <section className="section-anchor border-t border-slate-200/80 bg-white py-20 dark:border-slate-800 dark:bg-slate-950" id="masalah">
        <div className="container-app">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Masalah Nyata UMKM Indonesia
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              KlausulKu hadir karena kontrak hukum seharusnya tidak menjadi penghalang bisnis kecil
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((p) => (
              <Card key={p.title} className="p-6">
                <div
                  className={cn(
                    'mb-4 flex h-11 w-11 items-center justify-center rounded-xl',
                    p.accent === 'brand'
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                  )}
                >
                  <p.icon className="h-5 w-5" />
                </div>
                <p
                  className={cn(
                    'text-xs font-semibold uppercase tracking-wide',
                    p.accent === 'brand'
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-red-500 dark:text-red-400'
                  )}
                >
                  {p.label}
                </p>
                <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-anchor border-t border-slate-200/80 bg-white py-20 dark:border-slate-800 dark:bg-slate-950" id="fitur">
        <div className="container-app">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Fitur lengkap untuk memahami dokumen hukum tanpa perlu jadi ahli hukum
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-6">
            {features.map((f) => (
              <Card
                key={f.title}
                className="group p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/50 dark:hover:border-brand-800 dark:hover:shadow-brand-900/20"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-400 dark:group-hover:bg-brand-600 dark:group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-anchor py-20" id="cara-kerja">
        <div className="container-app">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Cara Kerja KlausulKu
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              4 langkah mudah dari upload sampai paham kontrakmu
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((s) => (
              <Card key={s.num} className="h-full p-6">
                <span className="text-3xl font-extrabold text-brand-100 dark:text-brand-900">{s.num}</span>
                <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack — JuaraVibeCoding: Gemini + Cloud Run */}
      <section className="section-anchor border-t border-slate-200/80 bg-white py-20 dark:border-slate-800 dark:bg-slate-950" id="teknologi">
        <div className="container-app">
          <div className="grid items-center gap-10 xl:grid-cols-2">
            <div>
              <div className="section-label mb-4">Built with Google AI</div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Dibangun dengan Gemini &amp; Cloud Run
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Proyek ini dibuat untuk #JuaraVibeCoding — dari ide ke Live URL menggunakan ekosistem
                Google AI. Gemini menganalisis dokumen hukum, Firebase menyimpan riwayat, dan Cloud Run
                men-host aplikasi production-ready.
              </p>
              <Button className="mt-6" onClick={onStart}>
                <Zap className="h-4 w-4" />
                Coba Analisis Sekarang
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {techStack.map((t) => (
                <Card key={t.name} className="p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    <Cloud className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
        <div className="container-app">
          <Card className="relative overflow-hidden border-brand-200 bg-gradient-to-br from-brand-50 to-white p-10 text-center dark:border-brand-800 dark:from-brand-950 dark:to-slate-950 sm:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-900/20" />
            <Sparkles className="mx-auto h-8 w-8 text-brand-500" />
            <h2 className="relative mt-4 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Siap Pahami Kontrakmu?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
              Upload dokumen sekarang. Gratis, tidak perlu daftar, hasil dalam detik.
            </p>
            <Button size="lg" onClick={onStart} id="cta-bottom-btn" className="relative mt-8">
              <Zap className="h-4 w-4" />
              Mulai Analisis Gratis
            </Button>
          </Card>
        </div>
      </section>
    </main>
  )
}

function ProductPreview() {
  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          KlausulKu — Analisis Dokumen
        </span>
      </div>
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-slate-100 p-5 sm:border-b-0 sm:border-r dark:border-slate-800">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <FileSearch className="h-3.5 w-3.5" />
            Hasil Analisis
          </p>
          <div className="space-y-2.5">
            <PreviewClause num="Pasal 5" risk="Tinggi" text="Tanggung jawab perbaikan bangunan..." />
            <PreviewClause num="Pasal 10" risk="Sedang" text="Tenggat pembayaran tanggal 5..." />
            <PreviewClause num="Pasal 2" risk="Rendah" text="Identitas para pihak yang..." />
          </div>
        </div>
        <div className="bg-slate-50/50 p-5 dark:bg-slate-900/30">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <MessageSquare className="h-3.5 w-3.5" />
            Tanya AI
          </p>
          <div className="space-y-2">
            <div className="rounded-xl rounded-tl-sm bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
              Pasal 5 mengandung risiko tinggi karena mewajibkan penyewa menanggung biaya perbaikan struktural...
            </div>
            <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-brand-600 px-3 py-2.5 text-sm text-white">
              Gimana cara negosiasi pasal ini?
            </div>
            <div className="flex gap-1 rounded-xl bg-white px-3 py-3 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:0ms] dark:bg-slate-600" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms] dark:bg-slate-600" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms] dark:bg-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function PreviewClause({
  num,
  risk,
  text,
}: {
  num: string
  risk: 'Rendah' | 'Sedang' | 'Tinggi'
  text: string
}) {
  const borderColor = {
    Rendah: 'border-l-emerald-500',
    Sedang: 'border-l-amber-500',
    Tinggi: 'border-l-red-500',
  }[risk]

  return (
    <div
      className={cn(
        'rounded-lg border border-slate-100 border-l-4 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50',
        borderColor
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{num}</span>
        <RiskBadge level={risk} size="sm" />
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  )
}
