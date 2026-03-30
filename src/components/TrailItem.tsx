import RouteMinimap from './RouteMinimap'
import './TrailItem.css'
import ClockIcon from './icons/ClockIcon'
import HorizontalArrowsIcon from './icons/HorizontalArrowsIcon'
import LineUpwardIcon from './icons/LineUpwardIcon'
import { Link } from 'react-router-dom';

type TrailItemProps = {
    name: string
    location: string
    distance: number
    height: number
    time: number
    trailID: string | number
    showViewBtn?: boolean
	gpxData: File | string | ArrayBuffer | null | undefined
    coordinates?: { latitude: number; longitude: number, elevation?: number }[]
}

export function TrailItem({ name, location, distance, height, time, trailID, showViewBtn = true, gpxData, coordinates }: TrailItemProps) {
    return (
        <article className="trail-item" aria-label={`Trail ${name}`}>
            <div className="trail-item-main">
                <div className="trail-item-details">
                    <h3 className="trail-item-name">{name}</h3>
                    {/* <p className="trail-item-location">{location}</p> */}

                    <div
                        className={`trail-item-metrics${showViewBtn ? '' : ' trail-item-metrics-bottom-margin'}`}
                        aria-label="Trail stats"
                    >
                        <div className="trail-item-metric">
                            <HorizontalArrowsIcon size={16} className="trail-item-metric-icon" />
                            <span>{distance} km</span>
                        </div>
                        <div className="trail-item-metric">
                            <LineUpwardIcon size={16} className="trail-item-metric-icon" />
                            <span>{height} m</span>
                        </div>
                        <div className="trail-item-metric">
                            <ClockIcon size={16} className="trail-item-metric-icon" />
                            <span>{time} min est.</span>
                        </div>
                    </div>
                </div>

                <div className="trail-item-map-holder" aria-label={`Trail ID ${trailID}`}>
                    <RouteMinimap 
                        gpxData={gpxData}
                    />
                </div>
            </div>
            {showViewBtn && (
                <Link 
                    className="trail-item-link" 
                    to={`/routes/${trailID}`}
                    state={{
                        fromPath: '/routes',
                        coordinates: coordinates,
                        routeName: name,
                        gpxData: gpxData
                    }}
                >
                    View
                </Link>
            )}
        </article>
    )
}