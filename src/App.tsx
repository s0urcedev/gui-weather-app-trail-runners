import { Route, Routes } from 'react-router-dom'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import RoutePage from './pages/RoutePage'
import Tabbar from './components/Tabbar'
import './App.css'

function App() {
  return (
    <>
      <div style={{ 
        paddingBottom: '80px',
        maxWidth: '100%',
        width: '1040px',
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/route" element={<RoutePage />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </div>
      <Tabbar />
    </>
  )
}

export default App
