import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RegistrationView from './views/RegistrationView'
import SignupView from './views/SignupView'
import SuccessView from './views/SuccessView'

// Same page split as the 2025 site: /registration (info) and /signup (form)
// were separate routes there; / was the home page (not yet designed for 2026).
function SignupPage() {
  const [submitted, setSubmitted] = useState(false)

  return submitted ? (
    <SuccessView />
  ) : (
    <SignupView onSuccess={() => setSubmitted(true)} />
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationView />} />
        <Route path="/registration" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
