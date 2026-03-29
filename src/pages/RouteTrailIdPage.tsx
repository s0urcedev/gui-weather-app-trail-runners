import { useLocation, useNavigate } from 'react-router-dom'
import { TrailItem } from '../components/TrailItem'
import { PastActivityItem } from '../components/PastActivityItem'
import BackArrowHeadIcon from '../components/icons/BackArrowHeadIcon'

type RouteLocationState = {
  fromPath?: string
}

function getReferrerPath(referrer: string): string | undefined {
  if (!referrer) {
    return undefined
  }

  try {
    const referrerUrl = new URL(referrer)
    const currentOrigin = window.location.origin

    if (referrerUrl.origin !== currentOrigin) {
      return undefined
    }

    return referrerUrl.pathname
  } catch {
    return undefined
  }
}

function RouteTrailIdPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const locationState = location.state as RouteLocationState | null

  const previousPath = locationState?.fromPath ?? getReferrerPath(document.referrer)

  let backButtonLabel = 'Back to all Trail Routes'
  let backButtonTarget = '/routes'

  if (previousPath === '/activities') {
    backButtonLabel = 'Back to Completed Activities'
    backButtonTarget = '/activities'
  } else if (/^\/activities\/[^/]+$/.test(previousPath ?? '')) {
    backButtonLabel = 'Back to Completed Activity'
    backButtonTarget = previousPath as string
  }

  return (
    <div className="App">
        <button
            type="button"
            className="backBtn"
            style={{
                marginBottom: '12px',
                border: 'none',
                background: 'transparent',
                color: '#2563eb',
                padding: 0,
                fontWeight: 400,
                cursor: 'pointer',
                fontSize: '20px',
                width: '100%',
                textAlign: 'left',
                gap: '5px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'start',
                marginBlockEnd: '10px',
                marginTop: '10px',
            }}
            onClick={() => navigate(backButtonTarget)}
        >
            <BackArrowHeadIcon />
            {backButtonLabel}
        </button>
        <TrailItem
            name="Unnamed Trail #1"
            location="Paris, France"
            distance={3.2}
            height={12}
            time={12}
            trailID="001"
            showViewBtn={false}
        />
        <h2 style={{marginTop: '20px', marginBottom: '5px'}}>Past Activities on this Trail</h2>
        <div className='items-list'>
            <PastActivityItem
              name="Tue 17 Feb 2026, 6:00PM - 6:13PM"
              distance={3.2}
              height={12}
              time={12}
              activityID="001"
            />
        </div>
        <div style={{
            position: 'fixed',
            bottom: 10,
            zIndex: 100,
            display: 'flex',
            justifyContent: 'space-between',
            width: 'min(1056px, 100%)',
        }}>
            <button
                type="button"
                className="deleteBtn"
                style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#FF0000',
                    padding: 0,
                    fontWeight: 400,
                    cursor: 'pointer',
                    fontSize: '20px',
                    width: 'max-content',
                    textAlign: 'left',
                    marginBlockEnd: '10px',
                    marginTop: '10px',
                }}
            >
                Delete Trail
            </button>
            <button
                type="button"
                className="openBtn"
                style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--blue)',
                    padding: 0,
                    fontWeight: 400,
                    cursor: 'pointer',
                    fontSize: '20px',
                    width: 'max-content',
                    textAlign: 'left',
                    marginBlockEnd: '10px',
                    marginTop: '10px',
                    marginRight: '25px',
                }}
            >
                Open in Up Next
            </button>
        </div>
    </div>
  )
}

export default RouteTrailIdPage