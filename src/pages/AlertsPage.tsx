import { useEffect, useState } from 'react';
import { AlertItem } from '../components/AlertItem';

function AlertsPage() {
  const nowUnix = Math.floor(Date.now() / 1000)
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const shouldUseDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark

        setIsDarkMode(shouldUseDarkMode)
        document.documentElement.setAttribute('data-theme', shouldUseDarkMode ? 'dark' : 'light')
    }, [])

    function handleThemeToggle() {
        const nextIsDarkMode = !isDarkMode
        setIsDarkMode(nextIsDarkMode)
        const nextTheme = nextIsDarkMode ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', nextTheme)
        localStorage.setItem('theme', nextTheme)
    }

  return (
    <div className="App">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <h1>Alerts</h1>
                <button
                    type="button"
                    onClick={handleThemeToggle}
                    style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                        color: 'var(--text-h)',
                        cursor: 'pointer',
                        font: 'inherit',
                        transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(event) => {
                        event.currentTarget.style.opacity = '0.7'
                    }}
                    onMouseLeave={(event) => {
                        event.currentTarget.style.opacity = '1'
                    }}
                >
                    {isDarkMode ? 'Light mode' : 'Dark mode'}
                </button>
            </div>
      
        <div className="items-list">
            <AlertItem
                msg="⚠️ Fresh Slippery Patch Reported"
                timestamp={nowUnix}
            />
            <AlertItem
                msg="⚠️ Approaching Muddy Ground"
                timestamp={nowUnix - 45}
            />
            <AlertItem
                msg="⚠️ Rain Beginning"
                timestamp={nowUnix - (2 * 60 + 5)}
            />
            <AlertItem
                msg="⚠️ Low Visibility Ahead"
                timestamp={nowUnix - (12 * 60)}
            />
            <AlertItem
                msg="⚠️ Fallen Branch Near Creek Crossing"
                timestamp={nowUnix - (59 * 60)}
            />
            <AlertItem
                msg="⚠️ Strong Wind on Ridge"
                timestamp={nowUnix - (4 * 60 * 60 + 20 * 60)}
            />
            <AlertItem
                msg="⚠️ Route Marker Missing at Fork"
                timestamp={nowUnix - (23 * 60 * 60 + 40 * 60)}
            />
            <AlertItem
                msg="⚠️ Bridge Access Closed"
                timestamp={nowUnix - (26 * 60 * 60)}
            />
            <AlertItem
                msg="⚠️ Trail Maintenance Ongoing"
                timestamp={nowUnix - (5 * 24 * 60 * 60 + 3 * 60 * 60 + 18 * 60)}
            />
        </div>
    </div>
  )
}

export default AlertsPage