import { Route, Routes, useMatch } from 'react-router-dom'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import RoutesPage from './pages/RoutesPage'
import Tabbar from './components/Tabbar'
import './App.css'
import ActivitiesPage from './pages/ActivitiesPage'
import AlertsPage from './pages/AlertsPage'
import RouteTrailIdPage from './pages/RouteTrailIdPage'

function App() {
  const isTrailDetailRoute = Boolean(useMatch('/routes/:trailID'))

  return (
    <>
      <div style={{ 
        paddingBottom: isTrailDetailRoute ? '0px' : '80px',
        maxWidth: '100%',
        width: '1040px',
      }}>
        <Routes>
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:trailID" element={<RouteTrailIdPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </div>
      {!isTrailDetailRoute && <Tabbar />}
    </>
  )
}

export default App
