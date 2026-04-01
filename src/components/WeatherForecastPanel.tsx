import type { WeatherData } from '../scripts/weather';
import WeatherForecastChart from './WeatherForecastChart';
import '../styles/WeatherForecastPanel.css';
import WeatherForecastRecommendations from './WeatherForecastRecommendations';
import WeatherForecastCurrent from './WeatherForecastCurrent';

type WeatherForecastPanelProps = {
  weatherData: WeatherData[]
};

export default function WeatherForecastPanel({ weatherData }: WeatherForecastPanelProps) {
  if (weatherData.length === 0) {
    return <section className="weather-panel">No weather data available.</section>;
  }
  return (
    <section className="weather-panel">
      <div className="weather-panel-left">
        <WeatherForecastCurrent current={weatherData[0]} />
        <WeatherForecastRecommendations weatherData={weatherData} />
      </div>
      <WeatherForecastChart weatherData={weatherData} />
    </section>
  )
}