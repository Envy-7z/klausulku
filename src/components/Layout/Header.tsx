import { useState } from 'react'
import { LayoutDashboard, LogOut, Loader2, Menu, Moon, Sun, X, AlertCircle, BookOpen } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/Button'
import Logo from './Logo'
import { cn } from '../../lib/utils'

interface HeaderProps {
  onGoHome: () => void
  onGoDashboard?: () => void
  onGoTemplates?: () => void
  onNavigateToSection: (sectionId: string) => void
}

const NAV_LINKS = [
  { id: 'masalah', label: 'Masalah' },
  { id: 'fitur', label: 'Fitur' },
  { id: 'cara-kerja', label: 'Cara Kerja' },
  { id: 'teknologi', label: 'Teknologi' },
]

export default function Header({ onGoHome, onGoDashboard, onGoTemplates, onNavigateToSection }: HeaderProps) {
  const { user, signInWithGoogle, signOut, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const handleSectionNav = (sectionId: string) => {
    setMobileOpen(false)
    onNavigateToSection(sectionId)
  }

  const handleSignIn = async () => {
    setAuthError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/popup-closed-by-user') return
      if (code === 'auth/unauthorized-domain') {
        setAuthError(
          'Domain belum diizinkan di Firebase. Tambahkan URL ini di Authentication → Authorized domains.'
        )
        return
      }
      if (code === 'auth/popup-blocked') {
        setAuthError('Popup diblokir browser. Izinkan popup untuk situs ini lalu coba lagi.')
        return
      }
      setAuthError('Gagal masuk dengan Google. Coba lagi.')
    }
  }

  return (
    <header className="glass-nav sticky top-0 z-[100] relative">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <button
          type="button"
          className="group rounded-lg transition-opacity hover:opacity-90"
          onClick={onGoHome}
          id="logo-btn"
        >
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={() => handleSectionNav(link.id)}
            >
              {link.label}
            </button>
          ))}
          {onGoTemplates && (
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={onGoTemplates}
            >
              <BookOpen className="h-4 w-4" />
              Template
            </button>
          )}
          {user && onGoDashboard && (
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={onGoDashboard}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          ) : user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                />
              )}
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignIn}
              id="login-btn"
              className="hidden sm:inline-flex"
            >
              Masuk
            </Button>
          )}

          {authError && (
            <p className="absolute right-4 top-full z-50 mt-2 max-w-xs rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/80 dark:text-red-300">
              {authError}
            </p>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-slate-200 transition-all duration-300 lg:hidden dark:border-slate-800',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="container-app flex flex-col gap-1 py-3">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => handleSectionNav(link.id)}
            >
              {link.label}
            </button>
          ))}
          {onGoTemplates && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => {
                setMobileOpen(false)
                onGoTemplates()
              }}
            >
              <BookOpen className="h-4 w-4" />
              Template
            </button>
          )}
          {user && onGoDashboard && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => {
                setMobileOpen(false)
                onGoDashboard()
              }}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
          )}
          {!user && !loading && (
            <Button variant="secondary" size="sm" className="mt-2 w-full" onClick={handleSignIn}>
              Masuk dengan Google
            </Button>
          )}
          {authError && !user && (
            <p className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {authError}
            </p>
          )}
          {user && (
            <Button variant="ghost" size="sm" className="mt-1 w-full sm:hidden" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
