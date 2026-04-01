import { useEffect, useState } from 'react'
import BrightnessIcon from './icons/BrightnessIcon'
import HalfMoonIcon from './icons/HalfMoonIcon'
import SunLightIcon from './icons/SunLightIcon'

type ThemeMode = 'light' | 'dark' | 'high-contrast'

const THEME_MODES: ThemeMode[] = ['light', 'dark', 'high-contrast']

function ThemeModeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  const [isPressed, setIsPressed] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme: ThemeMode = savedTheme && THEME_MODES.includes(savedTheme)
      ? savedTheme
      : (prefersDark ? 'dark' : 'light')

    setThemeMode(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
  }, [])

  function handleThemeToggle() {
    const currentIndex = THEME_MODES.indexOf(themeMode)
    const nextTheme = THEME_MODES[(currentIndex + 1) % THEME_MODES.length]
    setThemeMode(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  const themeIconByMode: Record<ThemeMode, React.ReactNode> = {
    light: <SunLightIcon size={18} />,
    dark: <HalfMoonIcon size={18} />,
    'high-contrast': <BrightnessIcon size={18} />,
  }

  return (
    <button
      type="button"
      onClick={handleThemeToggle}
      aria-label={`Theme: ${themeMode}`}
      style={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        border: '1px solid var(--border)',
        background: 'var(--bg)',
        color: 'var(--text-h)',
        cursor: 'pointer',
        font: 'inherit',
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'opacity 0.2s ease, transform 0.12s ease',
      }}
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