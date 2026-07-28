import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import ProfileWizard from './pages/ProfileWizard'
import DocumentUpload from './pages/DocumentUpload'
import AIMatching from './pages/AIMatching'
import ResultsPage from './pages/ResultsPage'
import DetailPage from './pages/DetailPage'
import useMatchStore from './store/useMatchStore'

export default function App() {
  const [page, setPage] = useState('landing')
  const [selectedId, setSelectedId] = useState(null)
  const getById = useMatchStore((s) => s.getById)

  const navigate = (p) => {
    window.scrollTo(0, 0)
    setPage(p)
  }

  const selectedScholarship = selectedId ? getById(selectedId) : null

  return (
    <div className="min-h-screen bg-bg">
      {page === 'landing' && <LandingPage onStart={() => navigate('profile')} onBrowse={() => navigate('profile')} />}

      {page === 'profile' && <ProfileWizard onComplete={() => navigate('documents')} onBack={() => navigate('landing')} />}

      {page === 'documents' && (
        <DocumentUpload onComplete={() => navigate('matching')} onBack={() => navigate('profile')} />
      )}

      {page === 'matching' && (
        <AIMatching onComplete={() => navigate('results')} onError={() => navigate('documents')} />
      )}

      {page === 'results' && (
        <ResultsPage
          onBack={() => navigate('landing')}
          onSelect={(s) => {
            setSelectedId(s.id)
            navigate('detail')
          }}
          onAddDocuments={() => navigate('documents')}
        />
      )}

      {page === 'detail' && selectedScholarship && (
        <DetailPage scholarship={selectedScholarship} onBack={() => navigate('results')} />
      )}

      {page === 'detail' && !selectedScholarship && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-ink-soft">This scholarship isn't loaded. Head back to your results.</p>
          <button onClick={() => navigate('results')} className="text-sm font-semibold text-primary">
            ← Back to results
          </button>
        </div>
      )}
    </div>
  )
}