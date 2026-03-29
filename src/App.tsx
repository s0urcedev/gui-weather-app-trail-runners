import { Route, Routes } from 'react-router-dom'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import RoutesPage from './pages/RoutesPage'
import Tabbar from './components/Tabbar'
import './App.css'
import ActivitiesPage from './pages/ActivitiesPage'
import AlertsPage from './pages/AlertsPage'

function App() {
  return (
    <>
      <div style={{ 
        paddingBottom: '80px',
        maxWidth: '100%',
        width: '1040px',
      }}>
        <Routes>
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </div>
      <Tabbar />
    </>
  )
}

export default App
