import { Link, Route, Routes } from 'react-router-dom'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import RoutePage from './pages/RoutePage'
import './App.css'

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: 12, padding: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/route">Router</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
