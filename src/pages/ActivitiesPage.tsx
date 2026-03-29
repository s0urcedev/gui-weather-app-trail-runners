import CalWithTickIcon from '../components/icons/CalWithTickIcon';
import { ImportGPXButton } from '../components/ImportGPXButton';
import { ImportPlaceholder } from '../components/ImportPlaceholder';

function ActivitiesPage() {
  return (
    <div className="App">
      <h1>Completed Activities</h1>
      <ImportGPXButton text="Import Completed Activities" icon={<CalWithTickIcon />} />
      
    <ImportPlaceholder icon={<CalWithTickIcon />} text="Import an activity and it'll appear here" />
    </div>
  )
}

export default ActivitiesPage