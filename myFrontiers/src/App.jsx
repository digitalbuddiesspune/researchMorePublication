
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ManuscriptModal from './components/ManuscriptModal.jsx'

const isUserLoggedIn = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken')
  const accessToken = localStorage.getItem('accessToken')
  return Boolean(token || accessToken)
}

function App() {
  const navigate = useNavigate()
  const [isManuscriptModalOpen, setIsManuscriptModalOpen] = useState(false)

  const handleSubmitResearchClick = () => {
    if (!isUserLoggedIn()) {
      navigate('/login')
      return
    }
    setIsManuscriptModalOpen(true)
  }

  const handleContinueSubmission = () => {
    setIsManuscriptModalOpen(false)
    navigate('/submit-research')
  }

  const handleStartNewSubmission = () => {
    setIsManuscriptModalOpen(false)
    navigate('/submit-research')
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <Header onSubmitResearchClick={handleSubmitResearchClick} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <Footer />
      <ManuscriptModal
        isOpen={isManuscriptModalOpen}
        onClose={() => setIsManuscriptModalOpen(false)}
        onContinue={handleContinueSubmission}
        onStartNew={handleStartNewSubmission}
      />
    </div>
  )
}

export default App