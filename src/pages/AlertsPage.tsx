import { AlertItem } from '../components/AlertItem';

function AlertsPage() {
  const nowUnix = Math.floor(Date.now() / 1000)

  return (
    <div className="App">
      <h1>Alerts</h1>
      
        <div className="items-list">
            <AlertItem
                msg="⚠️ Fresh Slippery Patch Reported"
                timestamp={nowUnix}
            />
            <AlertItem
                msg="⚠️ Approaching Muddy Ground"
                timestamp={nowUnix - 45}
            />
            <AlertItem
                msg="⚠️ Rain Beginning"
                timestamp={nowUnix - (2 * 60 + 5)}
            />
            <AlertItem
                msg="⚠️ Low Visibility Ahead"
                timestamp={nowUnix - (12 * 60)}
            />
            <AlertItem
                msg="⚠️ Fallen Branch Near Creek Crossing"
                timestamp={nowUnix - (59 * 60)}
            />
            <AlertItem
                msg="⚠️ Strong Wind on Ridge"
                timestamp={nowUnix - (4 * 60 * 60 + 20 * 60)}
            />
            <AlertItem
                msg="⚠️ Route Marker Missing at Fork"
                timestamp={nowUnix - (23 * 60 * 60 + 40 * 60)}
            />
            <AlertItem
                msg="⚠️ Bridge Access Closed"
                timestamp={nowUnix - (26 * 60 * 60)}
            />
            <AlertItem
                msg="⚠️ Trail Maintenance Ongoing"
                timestamp={nowUnix - (5 * 24 * 60 * 60 + 3 * 60 * 60 + 18 * 60)}
            />
        </div>
    </div>
  )
}

export default AlertsPage