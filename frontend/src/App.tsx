import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import ScheduleView from './views/ScheduleView'

// Owns its own Navbar/Footer rather than relying on a global App-level
// wrapper — ScheduleView does the same (see its own <Navbar />/<Footer />),
// since each page places Footer differently (fixed overlay here vs.
// absolute-positioned over ScheduleView's nebula art).
function HomeView() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-black px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Registration
        </h1>
        <p className="text-neutral-400">Coming soon</p>
      </main>
      <Footer className="fixed bottom-0 left-0 z-40" />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/schedule" element={<ScheduleView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
