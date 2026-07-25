import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProblemsView from './views/ProblemsView'
import MobileProblemsView from './views/MobileProblemsView'
import StatsView from './views/StatsView'
import MobileStatsView from './views/MobileStatsView'

function HomeView() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Registration</h1>
      <p className="text-neutral-500">Coming soon</p>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/problems" element={<ProblemsView />} />
        <Route
          path="/problems/mobile"
          element={<MobileProblemsView forcePreview />}
        />
        <Route path="/stats" element={<StatsView />} />
        <Route
          path="/stats/mobile"
          element={<MobileStatsView forcePreview />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
