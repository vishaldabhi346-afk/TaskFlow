import { Link, Route, Routes } from 'react-router-dom'
import BoardsPage from './pages/BoardsPage'
import BoardPage from './pages/BoardPage'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-indigo-700">TaskFlow</Link>
      </header>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<BoardsPage />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route path="*" element={<p>Page not found. <Link className="text-indigo-600 underline" to="/">Back to boards</Link></p>} />
        </Routes>
      </main>
    </div>
  )
}
