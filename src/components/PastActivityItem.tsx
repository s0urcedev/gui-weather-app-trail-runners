import './PastActivityItem.css'
import { Link } from 'react-router-dom'
import BackArrowHeadIcon from './icons/BackArrowHeadIcon'
import ClockIcon from './icons/ClockIcon'
import HorizontalArrowsIcon from './icons/HorizontalArrowsIcon'
import LineUpwardIcon from './icons/LineUpwardIcon'

type PastActivityItemProps = {
    name: string
    distance: number
    height: number
    time: number
    activityID: string | number
}

export function PastActivityItem({ name, distance, height, time, activityID }: PastActivityItemProps) {
    return (
        <Link to={`/activities/${activityID}`} className="past-activity-item-link">
            <article className="past-activity-item">
                <div className="past-activity-item-details">
                    <h3 className="past-activity-item-name">{name}</h3>

                    <div
                        className={`past-activity-item-metrics`}
                        aria-label="Trail stats"
                    >
                        <div className="past-activity-item-metric">
                            <HorizontalArrowsIcon size={16} className="past-activity-item-metric-icon" />
                            <span>{distance} km</span>
                        </div>
                        <div className="past-activity-item-metric">
                            <LineUpwardIcon size={16} className="past-activity-item-metric-icon" />
                            <span>{height} m</span>
                        </div>
                        <div className="past-activity-item-metric">
                            <ClockIcon size={16} className="past-activity-item-metric-icon" />
                            <span>{time} min</span>
                        </div>
                    </div>
                </div>

                <div
                    className="past-activity-item-arrow"
                    aria-hidden="true"
                >
                    <BackArrowHeadIcon className="past-activity-item-arrow-icon" size={16} strokeWidth={2} />
                </div>
            </article>
        </Link>
    )
}