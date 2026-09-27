import { useEffect, useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import './index.css'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import LandingPage from './pages/LandingPage'
import AnalyzePage from './pages/AnalyzePage'
import DashboardPage from './pages/DashboardPage'
import TemplatesPage from './pages/TemplatesPage'
import type { SavedDocument } from './types'

type Page = 'landing' | 'analyze' | 'dashboard' | 'templates'

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function AppContent() {
  const [page, setPage] = useState<Page>('landing')
  const [activeDoc, setActiveDoc] = useState<SavedDocument | null>(null)
  const [pendingScroll, setPendingScroll] = useState<string | null>(null)

  useEffect(() => {
    if (page !== 'landing' || !pendingScroll) return

    const timer = window.setTimeout(() => {
      scrollToSection(pendingScroll)
      setPendingScroll(null)
    }, 50)

    return () => window.clearTimeout(timer)
  }, [page, pendingScroll])

  const goHome = () => {
    setPage('landing')
    setActiveDoc(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goDashboard = () => {
    setPage('dashboard')
    setActiveDoc(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startAnalysis = () => {
    setPage('analyze')
    setActiveDoc(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openDocument = (doc: SavedDocument) => {
    setActiveDoc(doc)
    setPage('analyze')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goTemplates = () => {
    setPage('templates')
    setActiveDoc(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToSection = (sectionId: string) => {
    if (page !== 'landing') {
      setPage('landing')
      setActiveDoc(null)
      setPendingScroll(sectionId)
      return
    }
    scrollToSection(sectionId)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onGoHome={goHome}
        onGoDashboard={goDashboard}
        onGoTemplates={goTemplates}
        onNavigateToSection={navigateToSection}
      />
      {page === 'landing' && <LandingPage onStart={startAnalysis} />}
      {page === 'templates' && (
        <TemplatesPage onStartAnalysis={startAnalysis} onGoHome={goHome} />
      )}
      {page === 'dashboard' && (
        <DashboardPage
          onGoHome={goHome}
          onOpenDocument={openDocument}
          onStartAnalysis={startAnalysis}
        />
      )}
      {page === 'analyze' && (
        <AnalyzePage
          key={activeDoc?.documentId ?? 'new'}
          onGoHome={goHome}
          existingDoc={activeDoc}
        />
      )}
      <Footer onNavigateToSection={navigateToSection} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
