import { Route, Routes, useLocation, useMatch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RoutesPage from './pages/RoutesPage'
import Tabbar from './components/Tabbar'
import './App.css'
import AlertsPage from './pages/AlertsPage'
import RouteTrailIdPage from './pages/RouteTrailIdPage'

function App() {
  const isTrailDetailRoute = Boolean(useMatch('/routes/:trailID'))
  const location = useLocation()

  return (
    <>
      <div style={{ 
        paddingBottom: isTrailDetailRoute ? '0px' : '80px',
        maxWidth: '100%',
        width: '1040px',
        marginInline: 'auto',
      }}>
        <div className="page-fade-transition" key={location.pathname}>
          <Routes location={location}>
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/routes/:trailID" element={<RouteTrailIdPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </div>
      </div>
      {!isTrailDetailRoute && <Tabbar />}
    </>
  )
}

export default App
