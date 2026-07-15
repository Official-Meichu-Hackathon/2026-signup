import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'

function HomeView() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-black px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-white">
        Registration
      </h1>
      <p className="text-neutral-400">Coming soon</p>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
