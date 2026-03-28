import { Link, useLocation } from 'react-router-dom'
import CloudWithSunIcon from './icons/CloudWithSunIcon'
import ProfileIcon from './icons/ProfileIcon'
import RouteIcon from './icons/RouteIcon'
import './Tabbar.css'

type TabConfig = {
    path: string
    label: string
    icon: React.ReactNode
}

const tabs: TabConfig[] = [
    { path: '/', label: 'Home', icon: <CloudWithSunIcon size={24} strokeWidth={2.5} /> },
    { path: '/about', label: 'About', icon: <ProfileIcon size={24} strokeWidth={2.5} /> },
    { path: '/route', label: 'Route', icon: <RouteIcon size={24} strokeWidth={2.5} /> },
    { path: '/route', label: 'Route', icon: <RouteIcon size={24} strokeWidth={2.5} /> },
    { path: '/route', label: 'Route', icon: <RouteIcon size={24} strokeWidth={2.5} /> },
]

export default function Tabbar() {
  const location = useLocation()

  return (
        <div className="tabbar">
            <div class="tabbar-inner">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path
                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`tab ${isActive ? 'active' : 'inactive'}`}
                        >
                            <div className="tab-icon">{tab.icon}</div>
                            <div className="tab-label">{tab.label}</div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
