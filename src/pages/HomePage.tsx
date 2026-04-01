import { useState } from 'react';
import {
  fetchWeatherByCoordinatesMinutely15,
  getCoordinatesFromLocation,
  getUserCoordinates,
} from '../scripts/weather';
import WeatherForecastPanel from '../components/WeatherForecastPanel';
import ThemeModeToggle from '../components/ThemeModeToggle';
import type { FormEvent } from 'react';
import type { WeatherData } from '../scripts/weather';
import '../styles/HomePage.css';


export default function HomePage() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedLocation = location.trim();

    if (!trimmedLocation) {
      setError('Please enter a location.');
      setWeather(null);
      return
    }

    setIsLoading(true);
    setError(null);

    try {
      const coords = await getCoordinatesFromLocation(trimmedLocation);
      const nextWeather = await fetchWeatherByCoordinatesMinutely15(Array(13).fill(coords));
      setWeather(nextWeather);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to fetch weather.';
      setError(message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUseCurrentLocation() {
    setIsLoading(true);
    setError(null);

    try {
      const coords = await getUserCoordinates();
      const nextWeather = await fetchWeatherByCoordinatesMinutely15(Array(13).fill(coords));
      setWeather(nextWeather);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to fetch weather.';
      setError(message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <div className='header'>
        <h1>Current Weather</h1>
        <ThemeModeToggle />
      </div>

      <form onSubmit={handleSubmit} className='location-form'>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter city (e.g. Berlin or Paris,FR)"
        />

        <button
          type="submit"
          disabled={isLoading}
          onMouseEnter={(event) => {
            event.currentTarget.style.opacity = '0.7'
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.opacity = '1'
          }}
          style={{cursor: isLoading ? 'not-allowed' : 'pointer'}}
        >
          {isLoading ? 'Loading...' : 'Get weather'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isLoading}
        className="current-location-button"
        style={{cursor: isLoading ? 'not-allowed' : 'pointer'}}
        onMouseEnter={(event) => {
          event.currentTarget.style.opacity = '0.7'
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.opacity = '1'
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

