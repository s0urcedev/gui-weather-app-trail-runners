import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { ImportGPXButton } from '../components/ImportGPXButton';
import RouteIcon from '../components/icons/RouteIcon';

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

      <div className="Upload-Container">
        <input type="file" accept=".gpx" onChange={handleFileChange}/>
        <button onClick={upload} disabled={!selectedFile}>
          Upload Route
        </button>
      </div>
    </div>
  )
}

export default RoutesPage