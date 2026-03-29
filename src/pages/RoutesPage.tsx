import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { ImportGPXButton } from '../components/ImportGPXButton';
import RouteIcon from '../components/icons/RouteIcon';
import { ImportPlaceholder } from '../components/ImportPlaceholder';
import { TrailItem } from '../components/TrailItem';

function RoutesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("File selected: ", file.name);
    }
  };

  const upload = () => {
    if (!selectedFile) {
      alert("Only GPX files can be uploaded.");
      return;
    }

    alert('Ready to upload');
  };

  return (
    <div className="App">
      <h1>Trail Routes</h1>
      <ImportGPXButton text="Import Routes" icon={<RouteIcon />} />

      <div className="items-list">
        <TrailItem
          name="Unnamed Trail #1"
          location="Paris, France"
          distance={3.2}
          height={12}
          time={12}
          trailID="001"
        />
        <TrailItem
          name="Unnamed Trail #1"
          location="Paris, France"
          distance={3.2}
          height={12}
          time={12}
          trailID="001"
        />
      </div>

      <div className="Upload-Container">
        <input type="file" accept=".gpx" onChange={handleFileChange}/>
        <button onClick={upload} disabled={!selectedFile}>
          Upload Route
        </button>
      </div>

      <ImportPlaceholder icon={<RouteIcon />} text="Import a route to see it here" />
    </div>
  )
}

export default RoutesPage