import { useState } from 'react'
import BrightnessIcon from './icons/BrightnessIcon'
import HalfMoonIcon from './icons/HalfMoonIcon'
import SunLightIcon from './icons/SunLightIcon'
import '../styles/ThemeModeToggle.css'

type ThemeMode = 'light' | 'dark' | 'high-contrast'

const THEME_MODES: ThemeMode[] = ['light', 'dark', 'high-contrast']

// This component toggles between three CSS theme modes (light, dark, contrast)
// saves and syncs this via local storage
// and sets the data-theme attribute of the DOM
// which index.css appropriately updates variables
function ThemeModeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme: ThemeMode = savedTheme && THEME_MODES.includes(savedTheme)
      ? savedTheme
      : (prefersDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', initialTheme)
    return initialTheme;
  })
  const [isPressed, setIsPressed] = useState(false)

  // Cycles through themes
  function handleThemeToggle() {
    const currentIndex = THEME_MODES.indexOf(themeMode)
    const nextTheme = THEME_MODES[(currentIndex + 1) % THEME_MODES.length]
    setThemeMode(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  // Icons and themes
  const themeIconByMode: Record<ThemeMode, React.ReactNode> = {
    light: <SunLightIcon size={18} />,
    dark: <HalfMoonIcon size={18} />,
    'high-contrast': <BrightnessIcon size={18} />,
  }

  return (
    <button
      type="button"
      onClick={handleThemeToggle}
      className='theme-toggle-btn'
      style={{transform: isPressed ? 'scale(0.97)' : 'scale(1)'}}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={(event) => {
        event.currentTarget.style.opacity = '0.7'
      }}
      onMouseLeave={(event) => {
        setIsPressed(false)
        event.currentTarget.style.opacity = '1'
      }}
    >
      {themeIconByMode[themeMode]}
    </button>
  )
}

export default ThemeModeToggle