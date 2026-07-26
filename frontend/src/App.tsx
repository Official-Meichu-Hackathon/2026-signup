import './index.css'
import Home from './views/Home'
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import RegistrationMethodView from './views/RegistrationMethodView'
import ScheduleView from './views/ScheduleView'
import SignupView from './views/SignupView'
import SuccessView from './views/SuccessView'

// React Router's <Link> never touches scroll position on navigation (that's
// native <a>/full-navigation behavior only): with a hash it leaves the page
// wherever it was instead of jumping to the target id, and without one it
// still leaves the page at its previous scrollY instead of resetting to the
// top of the newly-loaded route. Runs after the target route has committed,
// so an id it's looking for already exists.
function RouteScrollHandler() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const raf = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
      return () => cancelAnimationFrame(raf)
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

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
      <RouteScrollHandler />
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
