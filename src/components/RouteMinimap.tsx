import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet-gpx'
import 'leaflet/dist/leaflet.css'
import '../styles/RouteMinimap.css'

type RouteMinimapProps = {
	gpxData: File | string | ArrayBuffer | null | undefined
	lineColor?: string
	lineWeight?: number
}

// Creates a Leaflet GPX route layer
// Wraps in a component to use in React
type GPXLayerProps = {
	gpxUrl: string
	options?: Record<string, unknown>
}
function GPXLayer({ gpxUrl, options = {} }: GPXLayerProps) {
  const map = useMap();

  useEffect(() => {
	// Creates GPX layer
    const gpx = new L.GPX(gpxUrl, {
		async: true,
		...options
    })
	.on('loaded', (e) => {
		// Frames the map to the GPX bounds
		map.fitBounds(e.target.getBounds(), {
			padding: [1,1]
		});
	}) // Add layer to map
    .addTo(map);

    return () => {
      map.removeLayer(gpx);
    };
  }, [map, gpxUrl]);

  return null;
}

// Renders Map and GPX data over it
export default function RouteMinimap({
	gpxData,
	lineColor = '#2563eb',
	lineWeight = 4,
}: RouteMinimapProps) {
	return(
		<div className={'map-container-div'}>
			{/* Map itself */}
			<MapContainer 
				center={[0,0]} 
				zoom={13} 
				scrollWheelZoom={false} 
				style={{height: '100%', width: '100%'}}
				zoomControl={false}
				dragging={false}
				doubleClickZoom={false}
			>
				{/* Attribution Layer */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{/* GPX Route Layer */}
				{gpxData && (
					<GPXLayer 
						gpxUrl={gpxData instanceof File ? URL.createObjectURL(gpxData) : (gpxData as string)}
						options={{ 
							polyline_options: { 
								color: lineColor,
								weight: lineWeight 
							},
							markers: {
								startIcon: null,
								endIcon: null,
								wptIcons: {}, 
							},
						}}
					/>
				)}
			</MapContainer>
		</div>)
}