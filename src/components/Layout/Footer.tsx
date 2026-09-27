import Logo from './Logo'

interface FooterProps {
  onNavigateToSection?: (sectionId: string) => void
}

export default function Footer({ onNavigateToSection }: FooterProps) {
  const links = [
    { id: 'masalah', label: 'Masalah' },
    { id: 'fitur', label: 'Fitur' },
    { id: 'cara-kerja', label: 'Cara Kerja' },
    { id: 'teknologi', label: 'Teknologi' },
  ]

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-app">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />
          {onNavigateToSection && (
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  onClick={() => onNavigateToSection(link.id)}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Pahami Kontrakmu dalam Hitungan Detik
        </p>
        <p className="mt-1 text-center text-xs text-slate-400 dark:text-slate-500">
          Powered by Gemini AI · Khusus untuk UMKM Indonesia
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
          KlausulKu memberikan analisis berbasis AI untuk membantu memahami dokumen kontrak. Hasil
          analisis bukan nasihat hukum resmi dan tidak menggantikan konsultasi dengan pengacara
          atau legal counsel yang berlisensi.
        </p>
      </div>
    </footer>
  )
}
