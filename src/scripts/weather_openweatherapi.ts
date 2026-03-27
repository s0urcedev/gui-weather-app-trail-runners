// Weather functions using OpenWeather API

export interface Coordinates {
	lat: number;
	lon: number;
}

export interface GeocodingResult extends Coordinates {
	name: string;
	country: string;
	state?: string;
}

export interface WeatherData {
	dt: number;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level?: number;
		grnd_level?: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	clouds: {
		all: number;
	};
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
	visibility: number;
	rain?: {
		'3h'?: number;
		'1h'?: number;
	};
	dt_txt?: string;
}

export type CurrentWeather = WeatherData;
export type ForecastItem = WeatherData;

export interface ForecastWeather {
	cod: string;
	message: number;
	cnt: number;
	list: ForecastItem[];
	city: {
		id: number;
		name: string;
		coord: Coordinates;
		country: string;
		population: number;
		timezone: number;
		sunrise: number;
		sunset: number;
	};
}

const OPENWEATHER_GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct";
const OPENWEATHER_CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHER_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

function getOpenWeatherApiKey(): string {
	const key = import.meta.env.VITE_OPENWEATHER_API_KEY;

	if (!key) {
		throw new Error("Missing OpenWeather API key. Set VITE_OPENWEATHER_API_KEY.");
	}

	return key;
}

/**
 * Convert a location string (e.g. "Berlin" or "Paris,FR") to lat/lon.
 */
export async function getCoordinatesFromLocation(location: string): Promise<Coordinates> {
	if (!location.trim()) {
		throw new Error("Location is required.");
	}

	const apiKey = getOpenWeatherApiKey();
	const url = new URL(OPENWEATHER_GEOCODING_URL);

	url.searchParams.set("q", location.trim());
	url.searchParams.set("limit", "1");
	url.searchParams.set("appid", apiKey);

	const response = await fetch(url.toString());

	if (!response.ok) {
		throw new Error(`Failed to geocode location: ${response.status} ${response.statusText}`);
	}

	const results = (await response.json()) as GeocodingResult[];

	if (!results.length) {
		throw new Error(`No coordinates found for location: ${location}`);
	}

	return {
		lat: results[0].lat,
		lon: results[0].lon,
	};
}

/**
 * Get user's current coordinates via browser geolocation API.
 */
export function getUserCoordinates(): Promise<Coordinates> {
	if (!('geolocation' in navigator)) {
		throw new Error('Geolocation is not supported by this browser.');
	}

	return new Promise<Coordinates>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				});
			},
			(error) => {
				reject(new Error(error.message || 'Unable to get current location.'));
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000,
			},
		);
	});
}

/**
 * Fetch current weather from OpenWeather Current Weather API by coordinates.
 */
export async function fetchCurrentWeatherByCoords(
	lat: number,
	lon: number,
): Promise<CurrentWeather> {
	const apiKey = getOpenWeatherApiKey();
	const url = new URL(OPENWEATHER_CURRENT_WEATHER_URL);

	url.searchParams.set("lat", String(lat));
	url.searchParams.set("lon", String(lon));
	url.searchParams.set("appid", apiKey);
	url.searchParams.set("units", "metric");

	const response = await fetch(url.toString());

	if (!response.ok) {
		throw new Error(`Failed to fetch weather: ${response.status} ${response.statusText}`);
	}

	return (await response.json()) as CurrentWeather;
}

/**
 * Fetch weather forecast from OpenWeather 5-day/3-hour Forecast API by coordinates.
 */
export async function fetchForecastByCoords(lat: number, lon: number): Promise<ForecastWeather> {
	const apiKey = getOpenWeatherApiKey();
	const url = new URL(OPENWEATHER_FORECAST_URL);

	url.searchParams.set("lat", String(lat));
	url.searchParams.set("lon", String(lon));
	url.searchParams.set("appid", apiKey);
	url.searchParams.set("units", "metric");

	const response = await fetch(url.toString());

	if (!response.ok) {
		throw new Error(`Failed to fetch forecast: ${response.status} ${response.statusText}`);
	}

	return (await response.json()) as ForecastWeather;
}

/**
 * Convenience wrapper: geocode a location string and fetch current weather.
 */
export async function fetchCurrentWeatherByLocation(location: string): Promise<CurrentWeather> {
	const { lat, lon } = await getCoordinatesFromLocation(location);

	return fetchCurrentWeatherByCoords(lat, lon);
}

/**
 * Convenience wrapper: geocode a location string and fetch weather forecast.
 */
export async function fetchForecastByLocation(location: string): Promise<ForecastWeather> {
	const { lat, lon } = await getCoordinatesFromLocation(location);

	return fetchForecastByCoords(lat, lon);
}
