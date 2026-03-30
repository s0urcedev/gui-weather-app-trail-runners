import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import type { ChangeEvent } from 'react'
import { ImportGPXButton } from '../components/ImportGPXButton';
import RouteIcon from '../components/icons/RouteIcon';
import { ImportPlaceholder } from '../components/ImportPlaceholder';
import { TrailItem } from '../components/TrailItem';

function RoutesPage() {
  // Reference for hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  
  // example gpx file:
  const [gpxData, setGpxData] = useState<string | null>(null);
  useState(() => {
    fetch('src/assets/fells_loop.gpx')
      .then(response => response.text())
      .then(data => setGpxData(data))
      .catch(error => console.error('Failed to load GPX file:', error));
  });

  // Trigger hidden input when button is clicked
  const handleImportClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
        ...xmlDoc.getElementsByTagName("trkpt"),
        ...xmlDoc.getElementsByTagName("wpt"),
        ...xmlDoc.getElementsByTagName("rtept")
      ];

      const allCoordinates = [];
      for (let i = 0; i < trackPoints.length; i++) {
        const lat = parseFloat(trackPoints[i].getAttribute("lat") || "0");
        const lon = parseFloat(trackPoints[i].getAttribute("lon") || "0");
        allCoordinates.push({ latitude: lat, longitude: lon });
      }
      
      // Send user to RouteTrailIdPage with the parsed GPX data
      navigate('/routes/new-route', {
        state: {
          fromPath: '/routes',
          coordinates: allCoordinates,
          routeName: file.name.replace('.gpx', ''),
          gpxData: gpxText
        }
      });
    };
    reader.readAsText(file!);
    event.target.value = '';
  };

  return (
    <div className="App">
      <h1>Trail Routes</h1>
      <div onClick={handleImportClick}>
        <ImportGPXButton text="Import Routes" icon={<RouteIcon />} />
      </div>

      <input type="file" accept=".gpx" ref={fileInputRef} style={{display: 'none' }} onChange={handleFileChange}/>

      <div className="items-list">
        <TrailItem
          name="Unnamed Trail #1"
          location="Paris, France"
          distance={3.2}
          height={12}
          time={12}
          trailID="001"
          gpxData={gpxData}
        />
        <TrailItem
          name="Unnamed Trail #1"
          location="Paris, France"
          distance={3.2}
          height={12}
          time={12}
          trailID="001"
          gpxData={gpxData}
        />
      </div>

      <ImportPlaceholder icon={<RouteIcon />} text="Import a route to see it here" />
    </div>
  )
}

export default RoutesPage