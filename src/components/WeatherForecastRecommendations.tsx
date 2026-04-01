import type { WeatherData } from '../scripts/weather';
import { recommendEquipmentForWeather } from '../scripts/equipmentRecommend';
import '../styles/WeatherForecastRecommendations.css';

type WeatherForecastRecommendations = {
  weatherData: WeatherData[]
};

export default function WeatherForecastRecommendations({ weatherData }: WeatherForecastRecommendations) {
    const equipmentRecommendation = recommendEquipmentForWeather(weatherData);
    const duration = 0.25*(weatherData.length-1);
    const durationHours = Math.floor(duration);
    const durationMinutes = Math.round((duration - durationHours) * 60).toString().padStart(2, '0');
    return (
      <div className="weather-panel-recommendations">
        <h4 className="weather-panel-recommendations-title">Equipment recommendations (for the next {durationHours}:{durationMinutes} hours)</h4>

        <div className="weather-panel-recommendations-groups">
          <div>
            <p className="weather-panel-recommendations-subtitle">Must-have</p>
            {equipmentRecommendation.mustHave.length === 0 ? (
              <p className="weather-panel-recommendations-empty">No must-have items.</p>
            ) : (
              <ul className="weather-panel-recommendations-list">
                {equipmentRecommendation.mustHave.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="weather-panel-recommendations-subtitle">Nice-to-have</p>
            {equipmentRecommendation.niceToHave.length === 0 ? (
              <p className="weather-panel-recommendations-empty">No nice-to-have items.</p>
            ) : (
              <ul className="weather-panel-recommendations-list">
                {equipmentRecommendation.niceToHave.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
}