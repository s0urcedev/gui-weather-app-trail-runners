import { useState } from 'react'
import type { ChangeEvent } from 'react'

function RoutePage() {
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
      <h2>Strava Route Import</h2>

      <div className="Upload-Container">
        <input type="file" accept=".gpx" onChange={handleFileChange}/>
        <button onClick={upload} disabled={!selectedFile}>
          Upload Route
        </button>
      </div>
    </div>
  )
}

export default RoutePage