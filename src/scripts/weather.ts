// Weather functions using Open Meteo API
import { apiCache } from './weatherCache'

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export async function getCoordinatesFromLocation(location: string): Promise<Coordinates> {
    const cacheKey = `coords_${location}`
    const cached = apiCache.get<Coordinates>(cacheKey)
    if (cached) return cached
    
    const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`);
    if (!resp.ok) {
        throw new Error('Unable to locate');
    }
    const data = (await resp.json()).results as { latitude: number, longitude: number }[];
    if (data.length === 0) {
        throw new Error('Unable to locate');
    }
    const result = data[0];
    apiCache.set(cacheKey, result)
    return result;
}

export function getUserCoordinates(): Promise<Coordinates> {
    if (!('geolocation' in navigator)) {
        throw new Error('Geolocation is not supported by this browser.');
    }

    return new Promise<Coordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(new Error(error.message || 'Unable to get current location.'));
            }
        );
    });
}


function getWeatherLabel(code: number): string {
    if (code === 0) return "☀️ sunny";
    if ([1, 2].includes(code)) return "⛅ partly cloudy";
    if (code === 3) return "☁️ cloudy";
    if ([45, 48].includes(code)) return "🌫️ foggy";
    if (code >= 51 && code <= 67) return "🌧️ rainy";
    if (code >= 71 && code <= 77) return "❄️ snowy";
    if (code >= 80 && code <= 82) return "🌦️ rain showers";
    if (code >= 95) return "⛈️ thunderstorm";
    return "? unknown";
}

export interface WeatherData extends Coordinates {
    time: string;
    elevation: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    dew_point_2m: number;
    apparent_temperature: number;
    sunshine_duration: number;
    precipitation: number;
    snowfall: number;
    rain: number;
    showers: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    visibility: number;
    weather_code: number;
    weather_label: string;
}

export async function fetchWeatherByCoordinatesMinutely15(coordinates: Coordinates[]): Promise<WeatherData[]> {
    if (coordinates.length === 0) {
        return [];
    }
    
    const cacheKey = `weather_${coordinates[0].latitude}_${coordinates[0].longitude}_${coordinates.length}`
    const cached = apiCache.get<WeatherData[]>(cacheKey)
    if (cached) return cached
    const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates[0].latitude}&longitude=${coordinates[0].longitude}&minutely_15=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,sunshine_duration,precipitation,snowfall,rain,showers,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,weather_code&forecast_minutely_15=${coordinates.length + 1}&timezone=auto`);
    if (!resp.ok) throw new Error('Unable to fetch');
    const data = await resp.json();
    const times = data.minutely_15.time;
    const res = [{
        latitude: data.latitude,
        longitude: data.longitude,
        time: data.minutely_15.time[0],
        elevation: data.elevation,
        temperature_2m: data.minutely_15.temperature_2m[0],
        relative_humidity_2m: data.minutely_15.relative_humidity_2m[0],
        dew_point_2m: data.minutely_15.dew_point_2m[0],
        apparent_temperature: data.minutely_15.apparent_temperature[0],
        sunshine_duration: data.minutely_15.sunshine_duration[0],
        precipitation: data.minutely_15.precipitation[0],
        snowfall: data.minutely_15.snowfall[0],
        rain: data.minutely_15.rain[0],
        showers: data.minutely_15.showers[0],
        wind_speed_10m: data.minutely_15.wind_speed_10m[0],
        wind_direction_10m: data.minutely_15.wind_direction_10m[0],
        wind_gusts_10m: data.minutely_15.wind_gusts_10m[0],
        visibility: data.minutely_15.visibility[0],
        weather_code: data.minutely_15.weather_code[0],
        weather_label: getWeatherLabel(data.minutely_15.weather_code[0])
    }];

    for (let i = 1; i < times.length - 1; i++) {
        const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates[i].latitude}&longitude=${coordinates[i].longitude}&minutely_15=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,sunshine_duration,precipitation,snowfall,rain,showers,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,weather_code&start_minutely_15=${times[i]}&&end_minutely_15=${times[i+1]}&timezone=auto`);
        if (!resp.ok) throw new Error('Unable to fetch');
        const data = await resp.json();
        res.push({
            latitude: data.latitude,
            longitude: data.longitude,
            time: data.minutely_15.time[0],
            elevation: data.elevation,
            temperature_2m: data.minutely_15.temperature_2m[0],
            relative_humidity_2m: data.minutely_15.relative_humidity_2m[0],
            dew_point_2m: data.minutely_15.dew_point_2m[0],
            apparent_temperature: data.minutely_15.apparent_temperature[0],
            sunshine_duration: data.minutely_15.sunshine_duration[0],
            precipitation: data.minutely_15.precipitation[0],
            snowfall: data.minutely_15.snowfall[0],
            rain: data.minutely_15.rain[0],
            showers: data.minutely_15.showers[0],
            wind_speed_10m: data.minutely_15.wind_speed_10m[0],
            wind_direction_10m: data.minutely_15.wind_direction_10m[0],
            wind_gusts_10m: data.minutely_15.wind_gusts_10m[0],
            visibility: data.minutely_15.visibility[0],
            weather_code: data.minutely_15.weather_code[0],
            weather_label: getWeatherLabel(data.minutely_15.weather_code[0])
        });
    }
    apiCache.set(cacheKey, res)
    return res;
}