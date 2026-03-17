import { Link, Route, Routes } from 'react-router-dom'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: 12, padding: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
