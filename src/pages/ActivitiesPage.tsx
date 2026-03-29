import { ActivityItem } from '../components/ActivityItem';
import CalWithTickIcon from '../components/icons/CalWithTickIcon';
import { ImportGPXButton } from '../components/ImportGPXButton';
import { ImportPlaceholder } from '../components/ImportPlaceholder';

function ActivitiesPage() {
  return (
    <div className="App">
      <h1>Completed Activities</h1>
      <ImportGPXButton text="Import Completed Activities" icon={<CalWithTickIcon />} />
      
    <div className="items-list">
        <ActivityItem
            name="Tue 17 Feb 2026, 6:00PM - 6:13PM"
            trailID="001"
            trailName="Unnamed Trail #1"
            distance={3.2}
            height={12}
            time={12}
            activityID="001"
        />
        <ActivityItem
            name="Tue 17 Feb 2026, 6:00PM - 6:13PM"
            trailID="002"
            trailName="Unnamed Trail #2"
            distance={3.2}
            height={12}
            time={12}
            activityID="002"
        />
    </div>
      
    <ImportPlaceholder icon={<CalWithTickIcon />} text="Import an activity and it'll appear here" />
    </div>
  )
}

export default ActivitiesPage