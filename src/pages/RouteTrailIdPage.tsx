import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { TrailItem } from '../components/TrailItem'
import { PastActivityItem } from '../components/PastActivityItem'
import BackArrowHeadIcon from '../components/icons/BackArrowHeadIcon'
import { fetchWeatherByCoordinatesMinutely15 } from '../scripts/weather'
import WeatherForecastPanel from '../components/WeatherForecastPanel'

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
  // default pace set to 6 min/KM
  const [pace, setPace] = useState<number>(6);
  const [paceSec, setPaceSec] = useState<number>(0);
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
    fetchWeatherByCoordinatesMinutely15(points15Min).then((data) => {
      setWeatherData(data);
    }).catch((error) => {
      console.error("Failed to fetch weather data:", error);
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
    <div className="App" style={{ paddingBottom: '60px' }}>
      {isOffline && (
        <div
          style={{
            marginBottom: '12px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: '#fef3c7',
            color: '#92400e',
            fontSize: '14px'
          }}
        >
          Offline - showing saved route data -
        </div>
      )}
        <button
            type="button"
            className="backBtn"
            style={{
                marginBottom: '12px',
                border: 'none',
                background: 'transparent',
                color: '#2563eb',
                padding: 0,
                fontWeight: 400,
                cursor: 'pointer',
                fontSize: '20px',
                width: '100%',
                textAlign: 'left',
                gap: '5px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'start',
                marginBlockEnd: '10px',
                marginTop: '10px',
            }}
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
          <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Route Forecast</h3>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Estimated Pace (min/km):
              <input 
                type="number" 
                value={pace} 
                onChange={(e) => setPace(Number(e.target.value))} 
                style={{ marginLeft: '10px', width: '50px', padding: '5px' }}
                min="1"
              /> min
              <input 
                type="number" 
                value={paceSec} 
                onChange={(e) => setPaceSec(Number(e.target.value))} 
                style={{ marginLeft: '5px', width: '50px', padding: '5px' }}
                min="0"
                max="59"
              /> sec
            </label>
            <button 
              onClick={handleCalculateWeather}
              style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Get Weather Forecast
            </button>
          </div>
        )}

        {weatherData && (
          <div style={{ margin: '20px 0' }}>
            <WeatherForecastPanel weatherData={weatherData} />
            <button 
              onClick={() => setWeatherData(null)} 
              style={{ marginTop: '10px', background: 'transparent', color: '#2563eb', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Change Pace & Recalculate
            </button>
          </div>
        )}

        <h2 style={{marginTop: '20px', marginBottom: '5px'}}>Past Activities on this Trail</h2>
        <div className='items-list'>
            <PastActivityItem
              name="Tue 17 Feb 2026, 6:00PM - 6:13PM"
              distance={3.2}
              height={12}
              time={12}
              activityID="001"
            />
        </div>
        <div style={{
            position: 'fixed',
            bottom: 10,
            zIndex: 100,
            display: 'flex',
            justifyContent: 'space-between',
            width: 'min(1056px, 100%)',
        }}>
            <button
                type="button"
                className="deleteBtn"
                onClick={handleDelete}
                style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#FF0000',
                    padding: 0,
                    fontWeight: 400,
                    cursor: 'pointer',
                    fontSize: '20px',
                    width: 'max-content',
                    textAlign: 'left',
                    marginBlockEnd: '10px',
                    marginTop: '10px',
                }}
            >
                Delete Trail
            </button>
            <button
              type="button"
              className="downloadBtn"
              onClick={handleDownloadGPXFile}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--blue)',
                padding: 0,
                fontWeight: 400,
                cursor: 'pointer',
                fontSize: '20px',
                width: 'max-content',
                textAlign: 'left',
                marginBlockEnd: '10px',
                marginTop: '10px',
              }}
            >
              Download GPX
            </button>
        </div>
    </div>
  )
}

export default RouteTrailIdPage