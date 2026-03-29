import { useState } from 'react'
import {
  fetchWeatherByCoordinatesMinutely15,
  getCoordinatesFromLocation,
  getUserCoordinates,
} from '../scripts/weather'
import WeatherForecastPanel from '../components/WeatherForecastPanel'
import type { FormEvent } from 'react'
import type { WeatherData } from '../scripts/weather'


export default function HomePage() {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState<WeatherData[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedLocation = location.trim()

    if (!trimmedLocation) {
      setError('Please enter a location.')
      setWeather(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const coords = await getCoordinatesFromLocation(trimmedLocation)
      const nextWeather = await fetchWeatherByCoordinatesMinutely15(Array(12).fill(coords));
      setWeather(nextWeather)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to fetch weather.'
      setError(message)
      setWeather(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUseCurrentLocation() {
    setIsLoading(true)
    setError(null)

    try {
      const coords = await getUserCoordinates()
      const nextWeather = await fetchWeatherByCoordinatesMinutely15(Array(12).fill(coords));
      setWeather(nextWeather)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to fetch weather.'
      setError(message)
      setWeather(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{textAlign: 'left' }}>
      <h1>Current Weather</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter city (e.g. Berlin or Paris,FR)"
          aria-label="Location"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-h)',
            font: 'inherit',
          }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid transparent',
            background: 'var(--accent-bg)',
            color: 'var(--text-h)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            font: 'inherit',
          }}
        >
          {isLoading ? 'Loading...' : 'Get weather'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLoading}
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--bg)',
          color: 'var(--text-h)',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          font: 'inherit',
          marginBottom: 16,
        }}
      >
        {isLoading ? 'Loading...' : 'Use current location'}
      </button>

      {error && (
        <p style={{ color: 'var(--accent)', marginBottom: 16 }} role="alert">
          {error}
        </p>
      )}

      {weather && <WeatherForecastPanel weatherData={weather} />}
    </main>
  )
}
