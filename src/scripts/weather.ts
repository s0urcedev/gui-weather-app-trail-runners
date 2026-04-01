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
        const timeout = setTimeout(() => {
            reject(new Error('Geolocation request timed out. Make sure you:\n1. Are on HTTPS or localhost\n2. Granted location permission to the browser\n3. Have location services enabled on your device'));
        }, 10000); // 10 second timeout

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeout);
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                clearTimeout(timeout);
                let message = 'Unable to get current location.';
                // Map geolocation API error codes to user-friendly messages
                if (error.code === 1) {
                    message = 'Location permission denied. Please enable location access for this site.';
                } else if (error.code === 2) {
                    message = 'Location unavailable. Check if location services are enabled.';
                } else if (error.code === 3) {
                    message = 'Geolocation request timed out.';
                }
                reject(new Error(message));
            },
            {
                enableHighAccuracy: false, // Use WiFi-based positioning (faster, less accurate)
                timeout: 8000, // Browser timeout before error callback
                maximumAge: 5 * 60 * 1000, // Allow cached location up to 5 minutes
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

type HistoricalHourlyData = {
    time?: string[];
    temperature_2m?: number[];
    relative_humidity_2m?: number[];
    dew_point_2m?: number[];
    apparent_temperature?: number[];
    sunshine_duration?: number[];
    precipitation?: number[];
    snowfall?: number[];
    rain?: number[];
    showers?: number[];
    wind_speed_10m?: number[];
    wind_direction_10m?: number[];
    wind_gusts_10m?: number[];
    visibility?: number[];
    weather_code?: number[];
}

function formatDateTimeForApi(dateTime: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0');
    const year = dateTime.getFullYear();
    const month = pad(dateTime.getMonth() + 1);
    const day = pad(dateTime.getDate());
    const hours = pad(dateTime.getHours());
    const minutes = pad(dateTime.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateForApi(dateTime: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0');
    const year = dateTime.getFullYear();
    const month = pad(dateTime.getMonth() + 1);
    const day = pad(dateTime.getDate());
    return `${year}-${month}-${day}`;
}

function roundToNearestQuarterHour(dateTime: Date): Date {
    const rounded = new Date(dateTime.getTime());
    const minutes = rounded.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    rounded.setSeconds(0, 0);
    rounded.setMinutes(roundedMinutes);
    return rounded;
}

function toNumber(value: unknown, fallback = 0): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function findNearestTimeIndex(times: string[], targetTime: Date): number {
    if (times.length === 0) {
        return 0;
    }

    const target = targetTime.getTime();
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < times.length; i++) {
        const parsed = new Date(times[i]).getTime();
        if (Number.isNaN(parsed)) {
            continue;
        }
        const distance = Math.abs(parsed - target);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
        }
    }

    return bestIndex;
}

async function fetchHistoricalWeatherByCoordinates(coordinates: Coordinates[], runStart: Date): Promise<WeatherData[]> {
    const durationMinutes = Math.max(0, (coordinates.length - 1) * 15);
    const runEnd = new Date(runStart.getTime() + durationMinutes * 60_000);
    const startDate = formatDateForApi(runStart);
    const endDate = formatDateForApi(runEnd);

    const results: WeatherData[] = [];

    for (let i = 0; i < coordinates.length; i++) {
        const coordinate = coordinates[i];
        const pointTime = new Date(runStart.getTime() + i * 15 * 60_000);
        const resp = await fetch(`https://archive-api.open-meteo.com/v1/era5?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,snowfall,rain,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,weather_code&timezone=auto`);
        if (!resp.ok) {
            throw new Error('Unable to fetch historical weather');
        }

        const data = await resp.json() as {
            latitude?: number;
            longitude?: number;
            elevation?: number;
            hourly?: HistoricalHourlyData;
        };
        const hourly = data.hourly ?? {};
        const times = hourly.time ?? [];
        const nearestIndex = findNearestTimeIndex(times, pointTime);
        const weatherCode = toNumber(hourly.weather_code?.[nearestIndex], -1);

        results.push({
            latitude: toNumber(data.latitude, coordinate.latitude),
            longitude: toNumber(data.longitude, coordinate.longitude),
            time: times[nearestIndex] ?? formatDateTimeForApi(pointTime),
            elevation: toNumber(data.elevation, 0),
            temperature_2m: toNumber(hourly.temperature_2m?.[nearestIndex]),
            relative_humidity_2m: toNumber(hourly.relative_humidity_2m?.[nearestIndex]),
            dew_point_2m: toNumber(hourly.dew_point_2m?.[nearestIndex]),
            apparent_temperature: toNumber(hourly.apparent_temperature?.[nearestIndex]),
            sunshine_duration: 0,
            precipitation: toNumber(hourly.precipitation?.[nearestIndex]),
            snowfall: toNumber(hourly.snowfall?.[nearestIndex]),
            rain: toNumber(hourly.rain?.[nearestIndex]),
            showers: 0,
            wind_speed_10m: toNumber(hourly.wind_speed_10m?.[nearestIndex]),
            wind_direction_10m: toNumber(hourly.wind_direction_10m?.[nearestIndex]),
            wind_gusts_10m: toNumber(hourly.wind_gusts_10m?.[nearestIndex]),
            visibility: toNumber(hourly.visibility?.[nearestIndex]),
            weather_code: weatherCode,
            weather_label: getWeatherLabel(weatherCode),
        });
    }

    return results;
}

async function fetchForecastWeatherByCoordinates(coordinates: Coordinates[], runStart: Date): Promise<WeatherData[]> {
    const durationMinutes = Math.max(0, (coordinates.length - 1) * 15);
    const runEnd = new Date(runStart.getTime() + durationMinutes * 60_000);
    const startDate = formatDateForApi(runStart);
    const endDate = formatDateForApi(runEnd);

    const results: WeatherData[] = [];

    for (let i = 0; i < coordinates.length; i++) {
        const coordinate = coordinates[i];
        const pointTime = new Date(runStart.getTime() + i * 15 * 60_000);
        const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}&start_date=${startDate}&end_date=${endDate}&minutely_15=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,sunshine_duration,precipitation,snowfall,rain,showers,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,weather_code&timezone=auto`);
        if (!resp.ok) {
            throw new Error('Unable to fetch forecast weather');
        }

        const data = await resp.json() as {
            latitude?: number;
            longitude?: number;
            elevation?: number;
            minutely_15?: HistoricalHourlyData;
        };
        const minutelyData = data.minutely_15 ?? {};
        const times = minutelyData.time ?? [];
        const nearestIndex = findNearestTimeIndex(times, pointTime);
        const weatherCode = toNumber(minutelyData.weather_code?.[nearestIndex], -1);

        results.push({
            latitude: toNumber(data.latitude, coordinate.latitude),
            longitude: toNumber(data.longitude, coordinate.longitude),
            time: times[nearestIndex] ?? formatDateTimeForApi(pointTime),
            elevation: toNumber(data.elevation, 0),
            temperature_2m: toNumber(minutelyData.temperature_2m?.[nearestIndex]),
            relative_humidity_2m: toNumber(minutelyData.relative_humidity_2m?.[nearestIndex]),
            dew_point_2m: toNumber(minutelyData.dew_point_2m?.[nearestIndex]),
            apparent_temperature: toNumber(minutelyData.apparent_temperature?.[nearestIndex]),
            sunshine_duration: toNumber(minutelyData.sunshine_duration?.[nearestIndex]),
            precipitation: toNumber(minutelyData.precipitation?.[nearestIndex]),
            snowfall: toNumber(minutelyData.snowfall?.[nearestIndex]),
            rain: toNumber(minutelyData.rain?.[nearestIndex]),
            showers: toNumber(minutelyData.showers?.[nearestIndex]),
            wind_speed_10m: toNumber(minutelyData.wind_speed_10m?.[nearestIndex]),
            wind_direction_10m: toNumber(minutelyData.wind_direction_10m?.[nearestIndex]),
            wind_gusts_10m: toNumber(minutelyData.wind_gusts_10m?.[nearestIndex]),
            visibility: toNumber(minutelyData.visibility?.[nearestIndex]),
            weather_code: weatherCode,
            weather_label: getWeatherLabel(weatherCode),
        });
    }

    return results;
}

export async function fetchWeatherByCoordinatesMinutely15(coordinates: Coordinates[], runStartTime?: string): Promise<WeatherData[]> {
    if (coordinates.length === 0) {
        return [];
    }

    let normalizedStartTime = runStartTime;
    if (runStartTime) {
        const parsedStartTime = new Date(runStartTime);
        if (!Number.isNaN(parsedStartTime.getTime())) {
            normalizedStartTime = formatDateTimeForApi(roundToNearestQuarterHour(parsedStartTime));
        }
    }

    const parsedRunStart = normalizedStartTime ? new Date(normalizedStartTime) : null;
    const useHistorical = Boolean(parsedRunStart && parsedRunStart.getTime() < Date.now());
    
    const cacheKey = `weather_${useHistorical ? 'historical' : 'forecast'}_${coordinates[0].latitude}_${coordinates[0].longitude}_${coordinates.length}_${normalizedStartTime ?? 'auto'}`
    const cached = apiCache.get<WeatherData[]>(cacheKey)
    if (cached) return cached

    if (useHistorical && parsedRunStart) {
        const historical = await fetchHistoricalWeatherByCoordinates(coordinates, parsedRunStart)
        apiCache.set(cacheKey, historical)
        return historical
    }

    const forecastStart = parsedRunStart && !Number.isNaN(parsedRunStart.getTime())
        ? parsedRunStart
        : roundToNearestQuarterHour(new Date());
    const forecast = await fetchForecastWeatherByCoordinates(coordinates, forecastStart)
    apiCache.set(cacheKey, forecast)
    return forecast;
}