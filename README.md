# Weather App for Trail Runners (ECS522U Group 54)

## How to run

1. Install dependencies:
```bash
npm i
```

2. Run in dev mode:
```bash
npm run dev
```

3. Access: `https://localhost:5173`

## Structure

- `src/components` - components
- `src/pages` - pages
- `src/styles` - style sheets
- `src/scripts` - scripts (functions reused in many components or logic worth separating)
- `App.tsx` - the page Router
- `public/example_routes` - example GPX routes to test import

## Main features and where to find them

### Weather API access
- Implemented in `scripts/weather.ts`
- Uses OpenMeteoAPI free for non-commercial use, open-source, does not require an API token/key
- Main functions fetch current user location, coordinates from the location name and weather forecast with 15 minute intervals for the coordinate array given

### Equipment recommendations
- Implemented in `scripts/equipment.ts`, `scripts/equipmentRecommend.ts` and `scripts/weatherConditions.ts`
- Checks weather data for conditions to build equipment recommendations

### WeatherForecastPanel
- Implemented in `components/WeatherForecastPanel.tsx`
- Uses 3 other components `WeatherForecastCurrent`, `WeatherForecastChart`, `WeatherForecastRecommendations` for current data, chart for the forecast and equipment recommendations

### Current weather + 3 hour forecast
- Implemented in `pages/HomePage.tsx`
- Uses `WeatherForecastPanel` component with either a location from input or current location

### Route import + list
- Implemented in `pages/RoutesPage.tsx`
- Allows to import GPX files, stores them in localStorage, allows to download them back (even offline) and view the forecast for them
- Example routes to test are given in `public/example_routes`

### Route forecast
- Implemented in `pages/RouteTrailIdPage.tsx`
- Allows to input an expected pace and builds a forecast for the route using `WeatherForecastPanel`

### Theme mode
- Implemented in `components/ThemeModeToggle.tsx`
- Allows to switch the theme: light, dark or extra conrast for easier readability