import { ActivityItem } from '../components/ActivityItem';
import CalWithTickIcon from '../components/icons/CalWithTickIcon';
import { ImportGPXButton } from '../components/ImportGPXButton';
import { ImportPlaceholder } from '../components/ImportPlaceholder';
import { Link } from 'react-router-dom';
import { useState } from 'react'

function ActivitiesPage() {
  // example gpx file:
  const [gpxData, setGpxData] = useState<string | null>(null);
  useState(() => {
    fetch('src/assets/fells_loop.gpx')
      .then(response => response.text())
      .then(data => setGpxData(data))
      .catch(error => console.error('Failed to load GPX file:', error));
  });

  return (
    <div className="App">
      <h1>Completed Activities</h1>
      <ImportGPXButton text="Import Completed Activities" icon={<CalWithTickIcon />} />
      <p style={{ margin: '8px 0 12px' }}>
        <Link to="/routes/001" state={{ fromPath: '/activities' }}>
          Open Trail #001 (Test)
        </Link>
      </p>
      
    <div className="items-list">
        <ActivityItem
            name="Tue 17 Feb 2026, 6:00PM - 6:13PM"
            trailID="001"
            trailName="Unnamed Trail #1"
            distance={3.2}
            height={12}
            time={12}
            activityID="001"
            gpxData={gpxData}
        />
        <ActivityItem
            name="Tue 17 Feb 2026, 6:00PM - 6:13PM"
            trailID="002"
            trailName="Unnamed Trail #2"
            distance={3.2}
            height={12}
            time={12}
            activityID="002"
            gpxData={gpxData}
        />
    </div>
      
    <ImportPlaceholder icon={<CalWithTickIcon />} text="Import an activity and it'll appear here" />
    </div>
  )
}

export default ActivitiesPage