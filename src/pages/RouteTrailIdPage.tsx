import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { TrailItem } from '../components/TrailItem'
import BackArrowHeadIcon from '../components/icons/BackArrowHeadIcon'
import { fetchWeatherByCoordinatesMinutely15 } from '../scripts/weather'
import WeatherForecastPanel from '../components/WeatherForecastPanel'
import '../components/RouteTrailIdPage.css'

type RouteLocationState = {
  fromPath?: string;
  // Data passed from RoutesPage
  coordinates?: { latitude: number; longitude: number; elevation?: number }[];
  routeName?: string; // Added routeName property
  gpxData?: string | null; // Added gpxData property
}

// Formula to calculate distance between two coordinates (Haversine formula)
function getDistanceFromLatLon(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getReferrerPath(referrer: string): string | undefined {
  if (!referrer) {
    return undefined
  }

  try {
    const referrerUrl = new URL(referrer)
    const currentOrigin = window.location.origin

    if (referrerUrl.origin !== currentOrigin) {
      return undefined
    }

    return referrerUrl.pathname
  } catch {
    return undefined
  }
}

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function RouteTrailIdPage() {
  const {trailID} = useParams();
  const location = useLocation()
  const navigate = useNavigate()
  const locationState = location.state as RouteLocationState | null

  // Delete function for trail
  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trail?")
    if (!confirmDelete) return;

    const storedRoutes = localStorage.getItem('savedRoutes');
    if (storedRoutes && trailID) {
      let routes = JSON.parse(storedRoutes);
      // Filter out trails that match the current trailID
      routes = routes.filter((route: any) => route.id !== trailID);
      // Update memory with new routes
      localStorage.setItem('savedRoutes', JSON.stringify(routes));

      // Send user back to the main route page
      navigate('/routes');
    }
  };

  const previousPath = locationState?.fromPath ?? getReferrerPath(document.referrer)

  // list of all coordinates from GPX file
  const [routeName, setRouteName] = useState('Uploaded Trail');
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number; elevation?: number }[]
  >([]);
  const [gpxData, setGpxData] = useState<string | null>(null);

  const [weatherData, setWeatherData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // default pace set to 6 min/KM
  const [pace, setPace] = useState<number>(6);
  const [paceSec, setPaceSec] = useState<number>(0);
  const [runStartDateTime, setRunStartDateTime] = useState<string>(() => toDateTimeLocalValue(new Date()));
  const totalPaceInMinutes = pace + (paceSec / 60);

  let totalDistance = 0;
  let totalElevation = 0;
  for (let i = 1; i < routeCoordinates.length; i++) {
    totalDistance += getDistanceFromLatLon(
      routeCoordinates[i-1].latitude, routeCoordinates[i-1].longitude,
      routeCoordinates[i].latitude, routeCoordinates[i].longitude
      );
    
    totalElevation += Math.max(0, (routeCoordinates[i].elevation || 0)- (routeCoordinates[i-1].elevation || 0));

    }

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Calculate 15 minute intervals
  const handleCalculateWeather = () => {
    if (routeCoordinates.length === 0) return;

    if (!navigator.onLine) {
      alert("You are offline. Weather forecasts cannot be fetched right now.")
      return;
    }

    setIsLoading(true);

    const points15Min = []; // Filtered coordinates will be saved here
    let accumulatedDistance = 0;

    const distancePer15Mins = 15 / totalPaceInMinutes; // Distance covered in 15 minutes at the given pace
    points15Min.push(routeCoordinates[0]); // first coordinate

    for (let i = 1; i < routeCoordinates.length; i++) {
      const prevPoint = routeCoordinates[i - 1];
      const currentPoint = routeCoordinates[i];
      const distance = getDistanceFromLatLon(prevPoint.latitude, prevPoint.longitude, currentPoint.latitude, currentPoint.longitude);
     
      // Add distance to accumulated distance
      accumulatedDistance += distance;

      if (accumulatedDistance >= distancePer15Mins) {
        points15Min.push(currentPoint);
        accumulatedDistance = 0; // reset for next interval
      }
    }

    console.log("Calculated 15 minute points for the entire route", points15Min)

    // Call weather API for each point
    fetchWeatherByCoordinatesMinutely15(points15Min, runStartDateTime).then((data) => {
      setWeatherData(data);
      setIsLoading(false);
    }).catch((error) => {
      console.error("Failed to fetch weather data:", error);
      setIsLoading(false);
    });
  }

  const handleDownloadGPXFile = () => {
    if (!gpxData) {
      alert('No GPX data available for this route.');
      return;
    }

    const safeFileName = `${routeName || 'route'}.gpx`
      .replace(/[^a-z0-9_\- ]/gi, '')
      .replace(/\s+/g, '_');

    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = safeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (locationState?.coordinates && locationState.coordinates.length > 0) {
      setRouteName(locationState.routeName ?? 'Uploaded Trail');
      setRouteCoordinates(locationState.coordinates);
      setGpxData(locationState.gpxData ?? null);
      return;
    }

    if (!trailID) return;

    const storedRoutes = localStorage.getItem('savedRoutes');
    if (!storedRoutes) return;

    try {
      const routes = JSON.parse(storedRoutes);
      const matchedRoute = routes.find((route: any) => route.id == trailID);

      if (matchedRoute) {
        setRouteName(matchedRoute.name ?? 'Uploaded Trail');
        setRouteCoordinates(matchedRoute.coordinates ?? []);
        setGpxData(matchedRoute.gpxData ?? null);
      }
    } catch (error) {
      console.log('Failed to load route from LocalStorage: ', error);
    }
  }, [locationState, trailID]);

  let backButtonLabel = 'Back to all Trail Routes'
  let backButtonTarget = '/routes'

  if (previousPath === '/activities') {
    backButtonLabel = 'Back to Completed Activities'
    backButtonTarget = '/activities'
  } else if (/^\/activities\/[^/]+$/.test(previousPath ?? '')) {
    backButtonLabel = 'Back to Completed Activity'
    backButtonTarget = previousPath as string
  }

  return (
    <div className="App trailPage">
      {isOffline && (
        <div className="offlineBanner">
          Offline - showing saved route data -
        </div>
      )}
        <button
            type="button"
            className="backBtn"
            onClick={() => navigate(backButtonTarget)}
        >
            <BackArrowHeadIcon />
            {backButtonLabel}
        </button>
        <TrailItem
            name={routeName}
            location="Uploaded File"
            distance={Number(totalDistance.toFixed(2))}
            height={Math.round(totalElevation)}
            time={Math.round(totalDistance * totalPaceInMinutes)}
            trailID="new"
            showViewBtn={false}
            gpxData={gpxData}
        />
        {routeCoordinates.length > 0 && !weatherData && (
          <div className = "forecastContainer">
            <h2 className = "forecastTitle">Route Forecast</h2>
            <label className = "forecastLabel">
              Estimated Pace (min/km):
              <input 
                type="number" 
                value={pace} 
                onChange={(e) => setPace(Number(e.target.value))} 
                className = "forecastInput"
                min="1"
              /> min
              <input 
                type="number" 
                value={paceSec} 
                onChange={(e) => setPaceSec(Number(e.target.value))} 
                className = "forecastInputSec"
                min="0"
                max="59"
              /> sec
            </label>
            <label className = "forecastDateLabel">
              Start Date & Time:
              <input
                type="datetime-local"
                value={runStartDateTime}
                onChange={(e) => setRunStartDateTime(e.target.value)}
                className = "forecastInputDate"
              />
            </label>
            <button 
              onClick={handleCalculateWeather}
              disabled={isLoading}
              className = "primaryBtn"
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.opacity = '1')}
            >
              {isLoading ? 'Loading...' : 'Get Weather Forecast'}
            </button>
          </div>
        )}

        {weatherData && (
          <div className = "weatherDataContainer">
            <WeatherForecastPanel weatherData={weatherData} selectedStartDateTime={runStartDateTime} />
            <button 
              onClick={() => setWeatherData(null)} 
              className = "primaryBtn fullWidthBtn"
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Change Pace or Start Time
            </button>
          </div>
        )}

        <div className = "footer">
            <button
                type="button"
                className="deleteBtn"
                onClick={handleDelete}
            >
                Delete Trail
            </button>
            <button
              type="button"
              className="downloadBtn"
              onClick={handleDownloadGPXFile}
            >
              Download GPX
            </button>
        </div>
    </div>
  )
}

export default RouteTrailIdPage