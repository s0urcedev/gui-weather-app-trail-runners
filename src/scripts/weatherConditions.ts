// This primarily uses open meteo API !!

import type { WeatherData } from "./weather";
import type { ConditionTag } from "./equipment";

const THRESHOLDS = {
  rainMmPer15Min: 1.0, 
  windSpeedKph:   38, //Beaufort scale 6, can be toned down if we want it to be more prominent results  
  gustSpeedKph:   50,  
  heatFeelsLike:  25,  
  coldFeelsLike:  5,   
  iceTemp:        0,    
};

export interface detectedCondition{
    tags: ConditionTag[];
    reasons: string[];
}

export function detectConditions(weather: WeatherData): detectedCondition {
    const tags = new Set<ConditionTag>();
    const reasons: string[] = [];

    const {
    apparent_temperature,
    precipitation,
    snowfall,
    rain,
    showers,
    wind_speed_10m,
    wind_gusts_10m,
    weather_code,
  } = weather;

  const totalRain  = rain + showers;
  //API weather codes, check open meteo API documentation for more codes if need to be incl
  const isRainCode = (weather_code >= 51 && weather_code <= 67)
                  || (weather_code >= 80 && weather_code <= 82)
                  || weather_code >= 95;
  const isSnowCode = weather_code >= 71 && weather_code <= 77;

    //Rain
  if (totalRain >= THRESHOLDS.rainMmPer15Min || isRainCode) {
    tags.add("heavy-rain");
    reasons.push(`Rain detected: ${totalRain.toFixed(1)} mm (code ${weather_code})`);
  }

  //Windy
  if (wind_speed_10m >= THRESHOLDS.windSpeedKph || wind_gusts_10m >= THRESHOLDS.gustSpeedKph) {
    tags.add("high-wind");
    reasons.push(`High wind: ${wind_speed_10m.toFixed(1)} km/h sustained, ${wind_gusts_10m.toFixed(1)} km/h gusts`);
  }

  //Heat
  if (apparent_temperature >= THRESHOLDS.heatFeelsLike) {
    tags.add("extreme-heat");
    reasons.push(`Extreme heat: feels like ${apparent_temperature}°C`);
  }

  //Cold
  if (apparent_temperature <= THRESHOLDS.coldFeelsLike) {
    tags.add("extreme-cold");
    reasons.push(`Extreme cold: feels like ${apparent_temperature}°C`);
  }

  //Mud
  if (tags.has("heavy-rain") && apparent_temperature > THRESHOLDS.iceTemp) {
    tags.add("mud");
    reasons.push("Muddy terrain likely: rain with above-freezing temperatures");
  }

  //Ice / Snow
  if (isSnowCode || snowfall > 0 || (precipitation > 0 && apparent_temperature <= THRESHOLDS.iceTemp)) {
    tags.add("ice-snow");
    reasons.push(`Ice/snow risk: snowfall ${snowfall} mm, feels like ${apparent_temperature}°C`);
  }

  return { tags: Array.from(tags), reasons };
}