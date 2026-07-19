import './index.css'
import Home from './views/Home'
import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import RegistrationMethodView from './views/RegistrationMethodView'
import ScheduleView from './views/ScheduleView'
import SignupView from './views/SignupView'
import SuccessView from './views/SuccessView'

// Owns its own Navbar/Footer rather than relying on a global App-level
// wrapper — ScheduleView does the same (see its own <Navbar />/<Footer />),
// since each page places Footer differently (static, on a purple card here,
// vs. absolute-positioned over ScheduleView's nebula art). Footer's own text
// is always white, so it needs a backdrop of its own — Home's last section is
// `bg-white` (see its `data-nav-theme="light"` section), unlike every other
// page which stays dark all the way down. The purple frosted-glass card is
// the same treatment Footer itself used before it was made fully transparent
// for the dark pages (see git history on Footer.tsx, node 786:4617/1368:61523).
function HomeView() {
  return (
    <>
      <Navbar />
      <Home />
      <div className="bg-[rgba(177,162,202,0.56)] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25),inset_0px_1px_8px_0px_rgba(255,255,255,0.5)] backdrop-blur-[35px]">
        <Footer />
      </div>
    </>
  )
}

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
        <Route path="/" element={<HomeView />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/schedule" element={<ScheduleView />} />
        <Route path="/registration" element={<RegistrationMethodView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
