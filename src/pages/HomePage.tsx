import { useState } from 'react'
import {
  fetchCurrentWeatherByCoords,
  fetchForecastByCoords,
  getCoordinatesFromLocation,
  getUserCoordinates,
} from '../scripts/weather'
import type { FormEvent } from 'react'
import type { CurrentWeather, ForecastWeather } from '../scripts/weather'

export default function HomePage() {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastWeather | null>(null)
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
      const { lat, lon } = await getCoordinatesFromLocation(trimmedLocation)
      const [nextWeather, nextForecast] = await Promise.all([
        fetchCurrentWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
      ])
      setWeather(nextWeather)
      setForecast(nextForecast)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to fetch weather.'
      setError(message)
      setWeather(null)
      setForecast(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUseCurrentLocation() {
    setIsLoading(true)
    setError(null)

    try {
      const { lat, lon } = await getUserCoordinates()
      const [nextWeather, nextForecast] = await Promise.all([
        fetchCurrentWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
      ])
      setWeather(nextWeather)
      setForecast(nextForecast)
      setLocation(nextForecast.city.name)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to fetch weather.'
      setError(message)
      setWeather(null)
      setForecast(null)
    } finally {
      setIsLoading(false)
    }
  }

  const condition = weather?.weather?.[0]
  const forecastPreview = forecast?.list.slice(0, 8) ?? []
  const currentTimestamp = weather
    ? new Date(weather.dt * 1000).toLocaleString()
    : null
  const locationLabel = forecast?.city.name || location || 'Selected location'
  const countryLabel = forecast?.city.country

  return (
    <main style={{ maxWidth: 560, margin: '40px auto', padding: '0 16px', textAlign: 'left' }}>
      <h1 style={{ marginBottom: 12 }}>Current Weather</h1>

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

      {weather && (
        <>
          <section
            style={{
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 16,
              background: 'var(--social-bg)',
              marginBottom: 16,
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>
              {locationLabel}
              {countryLabel ? `, ${countryLabel}` : ''}
            </h2>
            <article
              style={{
                display: 'grid',
                gap: 8,
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '10px 12px',
                background: 'var(--bg)',
              }}
            >
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-h)' }}>
                {currentTimestamp ?? 'Now'}
              </p>
              <p style={{ margin: 0 }}>
                {condition?.main}
                {condition?.description ? ` (${condition.description})` : ''}
              </p>
              <p style={{ margin: 0 }}>
                Temp: {Math.round(weather.main.temp)}°C · Feels like: {Math.round(weather.main.feels_like)}°C
              </p>
              <p style={{ margin: 0 }}>
                Min/Max: {Math.round(weather.main.temp_min)}°C / {Math.round(weather.main.temp_max)}°C
              </p>
              <p style={{ margin: 0 }}>
                Humidity: {weather.main.humidity}% · Wind: {weather.wind.speed} m/s · Clouds: {weather.clouds.all}%
              </p>
              <p style={{ margin: 0 }}>
                Rain: {typeof weather.rain?.['1h'] === 'number' ? `${weather.rain['1h']} mm (1h)` : '0 mm'}
              </p>
            </article>
          </section>

          {forecast && (
            <section
              style={{
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 16,
                background: 'var(--social-bg)',
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 12 }}>Forecast</h2>
              {forecastPreview.length === 0 ? (
                <p>No forecast data available.</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {forecastPreview.map((item) => {
                    const itemCondition = item.weather[0]
                    const rainVolume = item.rain?.['3h']

                    return (
                      <article
                        key={item.dt}
                        style={{
                          display: 'grid',
                          gap: 8,
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '10px 12px',
                          background: 'var(--bg)',
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-h)' }}>
                          {item.dt_txt ?? new Date(item.dt * 1000).toLocaleString()}
                        </p>
                        <p style={{ margin: 0 }}>
                          {itemCondition?.main}
                          {itemCondition?.description ? ` (${itemCondition.description})` : ''}
                        </p>
                        <p style={{ margin: 0 }}>
                          Temp: {Math.round(item.main.temp)}°C · Feels like: {Math.round(item.main.feels_like)}°C
                        </p>
                        <p style={{ margin: 0 }}>
                          Min/Max: {Math.round(item.main.temp_min)}°C / {Math.round(item.main.temp_max)}°C
                        </p>
                        <p style={{ margin: 0 }}>
                          Humidity: {item.main.humidity}% · Wind: {item.wind.speed} m/s · Clouds: {item.clouds.all}%
                        </p>
                        <p style={{ margin: 0 }}>
                          Rain (3h): {typeof rainVolume === 'number' ? `${rainVolume} mm` : '0 mm'}
                        </p>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </main>
  )
}
