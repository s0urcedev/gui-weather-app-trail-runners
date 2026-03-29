import CalWithTickIcon from '../components/icons/CalWithTickIcon';
import { ImportGPXButton } from '../components/ImportGPXButton';

function ActivitiesPage() {
  return (
    <div className="App">
      <h1>Completed Activities</h1>
      <ImportGPXButton text="Import Completed Activities" icon={<CalWithTickIcon />} />
    </div>
  )
}

export default ActivitiesPage