import { formatDate, formatTime, formatValue } from '../scripts/formatting';
import type { WeatherData } from '../scripts/weather';
import '../styles/WeatherForecastCurrent.css';

type WeatherForecastCurrentProps = {
  current: WeatherData
};

export default function WeatherForecastCurrent({ current }: WeatherForecastCurrentProps) {
  return (
    <div className="weather-panel-current">
      <div className="weather-panel-current-temp">
        {formatValue(current.temperature_2m)}°C
      </div>
      <div className="weather-panel-current-label">
        {current.weather_label}
      </div>

      <div className="weather-panel-current-metrics">
        <div>
          <div>Apparent:</div><div><strong>{formatValue(current.apparent_temperature)}°C</strong></div>
        </div>
        <div>
          <div>Elevation:</div><div><strong>{formatValue(current.elevation)} m</strong></div>
        </div>
        <div>
          <div>Humidity:</div><div><strong>{formatValue(current.relative_humidity_2m)}%</strong></div>
        </div>
        <div>
          <div>Precipitation:</div><div><strong>{formatValue(current.precipitation)} mm</strong></div>
        </div>
        <div>
          <div>Wind speed:</div><div><strong>{formatValue(current.wind_speed_10m)} km/h</strong></div>
        </div>
        <div>
          <div>Visibility:</div><div><strong>{formatValue(current.visibility)} m</strong></div>
        </div>
        <div>
          <div>Date:</div><div><strong>{formatDate(current.time)}</strong></div>
        </div>
        <div>
          <div>Time:</div><div><strong>{formatTime(current.time)}</strong></div>
        </div>
      </div>
    </div>
  );
}