import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import type { ChangeEvent } from 'react'
import { createPortal } from 'react-dom';
import { ImportGPXButton } from '../components/ImportGPXButton';
import RouteIcon from '../components/icons/RouteIcon';
import { ImportPlaceholder } from '../components/ImportPlaceholder';
import { TrailItem } from '../components/TrailItem';

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

function RoutesPage() {
  // Reference for hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  
  // State for pop up to name file
  const [showPopUp, setShowPopUp] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [routeDate, setRouteDate] = useState('');

  // Temporarily hold data while file name is entered
  const [tempRouteData, setTempRouteData] = useState<{
    coordinates: { latitude: number; longitude: number, elevation: number }[];
    gpxText: string;
  } | null>(null);

  // Hold saved routes for the list
  const [savedRouteList, setSavedRouteList] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;

    setIsDarkMode(shouldUseDarkMode);
    document.documentElement.setAttribute('data-theme', shouldUseDarkMode ? 'dark' : 'light');
  }, []);

  const handleThemeToggle = () => {
    const nextIsDarkMode = !isDarkMode;
    setIsDarkMode(nextIsDarkMode);
    const nextTheme = nextIsDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handlePopupButtonHover = (
    event: React.MouseEvent<HTMLButtonElement>,
    isHovered: boolean
  ) => {
    event.currentTarget.style.opacity = isHovered ? '0.7' : '1';
  };

  // Delete route from list
  const handleDeleteRoute = (idToDelete: string | number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this route?');
    if (!confirmDelete) return;

    const storedRoutes = localStorage.getItem('savedRoutes');
    if (storedRoutes) {
      let routes = JSON.parse(storedRoutes);
      // Remove from localStorage
      routes = routes.filter((route: any) => route.id !== idToDelete.toString());
      localStorage.setItem('savedRoutes', JSON.stringify(routes));
      
      setSavedRouteList(prevList => prevList.filter(route => route.id !== idToDelete.toString()));
      }
    }

  // Load GPX data
  useEffect(() => {
    const storedRoutes = localStorage.getItem('savedRoutes');
    if (storedRoutes) {
      try {
        const allRoutes = JSON.parse(storedRoutes);
        // Keep only the routes that have valid GPX data
        const upcomingRoutes = allRoutes.filter((route: any) => {
          if (!route.date) return true;
          return new Date(route.date).getTime() >= new Date().setHours(0, 0, 0, 0);
      });

      setSavedRouteList(upcomingRoutes);
    } catch (error) {
      console.error('Failed to parse saved routes from localStorage:', error);
    }
  }
}, []);

  // Trigger hidden input when button is clicked
  const handleImportClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check how many routes are currently saved - if 5 already uploaded, prevent upload.
    const existingRouteStr = localStorage.getItem('savedRoutes');
    if (existingRouteStr) {
      try {
        const existingRoutes = JSON.parse(existingRouteStr);
        if (existingRoutes.length > 5) {
          alert('You have reached the maximum number of saved routes (5). Please delete an existing route before adding a new one.');
          return;
        }
      } catch (error) {
        console.error('Failed to parse existing routes from localStorage:', error);
      }
    }

    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log("Selected file:", file.name);

    // Read and parse the GPX file
    const reader = new FileReader();
    reader.onload = (e) => {
      const gpxText = e.target?.result as string;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(gpxText, "text/xml");
      const trackPoints = [
        ...Array.from(xmlDoc.getElementsByTagName("trkpt")),
        ...Array.from(xmlDoc.getElementsByTagName("wpt")),
        ...Array.from(xmlDoc.getElementsByTagName("rtept"))
      ];

      const allCoordinates = [];
      for (let i = 0; i < trackPoints.length; i++) {
        const lat = parseFloat(trackPoints[i].getAttribute("lat") || "0");
        const lon = parseFloat(trackPoints[i].getAttribute("lon") || "0");
        const eleTag = trackPoints[i].getElementsByTagName("ele")[0];
        const ele = eleTag && eleTag.textContent ? parseFloat(eleTag.textContent) : 0;
        allCoordinates.push({ latitude: lat, longitude: lon, elevation: ele });
      }
      
      // Temporarily store the parsed data
      setTempRouteData({ coordinates: allCoordinates, gpxText });
      
      // Temporarily set route name to file name without extension
      setRouteName(file.name.replace('.gpx', ''));
    
      setShowPopUp(true);

    };
    reader.readAsText(file!);
    event.target.value = '';
  };

  const handleSaveRoute = () => {
    const cleanedName = routeName.trim();
    if (!cleanedName) {
      alert('Please enter a valid route name.');
      return;
    }
    if (!tempRouteData) return;

    // Fetch exisitng routes from localStorage and append the new route
    const existingRouteStr = localStorage.getItem('savedRoutes');
    let exisitngRoutes: any[] = [];

    if (existingRouteStr) {
      try {
        exisitngRoutes = JSON.parse(existingRouteStr);
      } catch (error) {
        console.error('Failed to parse existing routes from localStorage:', error);
      }
    }

    // Check if a route with the same name already exists
    const isDuplicate = exisitngRoutes.some(route => route.name && route.name.toLowerCase() === cleanedName.toLowerCase());

    if (isDuplicate) {
      alert('A route with this name already exists. Please choose a different name.');
      return;
    }

    // Calculate distance and time
    let totalDist = 0;
    let totalElevationGain = 0;
    for (let i = 1; i < tempRouteData.coordinates.length; i++) {
      totalDist += getDistanceFromLatLon(
        tempRouteData.coordinates[i-1].latitude, tempRouteData.coordinates[i-1].longitude,
        tempRouteData.coordinates[i].latitude, tempRouteData.coordinates[i].longitude
      );
      // Cumulative elevation gain (only count positive elevation changes)
      const elevationDiff = tempRouteData.coordinates[i].elevation - tempRouteData.coordinates[i-1].elevation;
      if (elevationDiff > 0) {
        totalElevationGain += elevationDiff;
      }
    }
    const estimatedTime = Math.round(totalDist * 6);

    // Create a new object with unique ID
    const newTrailID = Date.now().toString();
    const newRouteObject = {
      id: newTrailID,
      name: cleanedName,
      date: routeDate,
      distance: Number(totalDist.toFixed(2)),
      time: estimatedTime, 
      height: Math.round(totalElevationGain),
      coordinates: tempRouteData.coordinates,
      gpxData: tempRouteData.gpxText
    }

    // Append the new route to the existing routes and save back to localStorage
    exisitngRoutes.push(newRouteObject);
    localStorage.setItem('savedRoutes', JSON.stringify(exisitngRoutes));

    // Close pop up
    setShowPopUp(false);

    // Send user to RouteTrailIdPage with the parsed GPX data
    navigate(`/routes/${newTrailID}`, {
      state: {
        fromPath: '/routes',
        coordinates: tempRouteData.coordinates,
        routeName: cleanedName,
        gpxData: tempRouteData.gpxText
      }
    });
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1>Trail Routes</h1>
        <button
          type="button"
          onClick={handleThemeToggle}
          style={{
            marginTop: 8,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-h)',
            cursor: 'pointer',
            font: 'inherit',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.opacity = '0.7'
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.opacity = '1'
          }}
        >
          {isDarkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
      <div onClick={handleImportClick}>
        <ImportGPXButton text="Import Routes" icon={<RouteIcon />} />
      </div>

      <input type="file" accept=".gpx" ref={fileInputRef} style={{display: 'none' }} onChange={handleFileChange}/>

      <div className="items-list">
        {/* Loop through saved routes and display them*/}
        {savedRouteList.map((route) => (
          <TrailItem
            key={route.id}
            name={route.name}
            location={route.date ? new Date(route.date).toLocaleDateString() : 'Upcoming Route'}
            distance={route.distance || 0}
            height={route.height || 0}
            time={route.time || 0}
            trailID={route.id}
            gpxData={route.gpxData}
            coordinates = {route.coordinates}
            onDelete={handleDeleteRoute}
          />
        ))}
      </div>

      {savedRouteList.length === 0 && (
        <ImportPlaceholder icon={<RouteIcon />} text="Import a route to see it here" />
      )}

      {showPopUp && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '350px',
            display: 'flex', flexDirection: 'column', gap: '15px', color: 'black', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Name Your Route</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Give this trail a unique name to save it to your list.</p>
            <input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="e.g. Sunday Long Run"
              style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
              autoFocus
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => setShowPopUp(false)}
                onMouseEnter={(event) => handlePopupButtonHover(event, true)}
                onMouseLeave={(event) => handlePopupButtonHover(event, false)}
                style={{ background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', padding: '8px 16px', fontWeight: '500', transition: 'opacity 0.2s ease' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoute}
                onMouseEnter={(event) => handlePopupButtonHover(event, true)}
                onMouseLeave={(event) => handlePopupButtonHover(event, false)}
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'opacity 0.2s ease' }}
              >
                Save Route
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default RoutesPage