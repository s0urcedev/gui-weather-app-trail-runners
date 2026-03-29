import './ActivityItem.css'
import ClockIcon from './icons/ClockIcon'
import HorizontalArrowsIcon from './icons/HorizontalArrowsIcon'
import LineUpwardIcon from './icons/LineUpwardIcon'

type ActivityItemProps = {
	name: string
	trailID: string | number
	trailName: string
	distance: number
	height: number
	time: number
	activityID: string | number
}

export function ActivityItem({ name, trailID, trailName, distance, height, time, activityID }: ActivityItemProps) {
	return (
		<article className="activity-item" aria-label={`Activity ${name}`}>
			<div className="activity-item-main">
				<div className="activity-item-details">
					<h3 className="activity-item-name">{name}</h3>
					<a className="activity-item-location" href={`/routes/${trailID}`}>
						{trailName}
					</a>

					<div className="activity-item-metrics" aria-label="Activity stats">
						<div className="activity-item-metric">
							<HorizontalArrowsIcon size={16} className="activity-item-metric-icon" />
							<span>{distance} km</span>
						</div>
						<div className="activity-item-metric">
							<LineUpwardIcon size={16} className="activity-item-metric-icon" />
							<span>{height} m</span>
						</div>
						<div className="activity-item-metric">
							<ClockIcon size={16} className="activity-item-metric-icon" />
							<span>{time} min</span>
						</div>
					</div>
				</div>

				<div className="activity-item-map-holder" aria-label={`Activity ID ${activityID}`}>
				</div>
			</div>

			<a className="activity-item-link" href={`/activities/${activityID}`}>
				View
			</a>
		</article>
	)
}
