import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScheduleView from './views/ScheduleView'

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
        <Route path="/schedule" element={<ScheduleView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
