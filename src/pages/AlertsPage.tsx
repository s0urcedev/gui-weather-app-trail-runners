import { useCallback, useEffect, useState } from 'react'
import { AlertItem } from '../components/AlertItem'
import ThemeModeToggle from '../components/ThemeModeToggle'
import { ImportPlaceholder } from '../components/ImportPlaceholder'
import BellIcon from '../components/icons/BellIcon'
import { fetchWeatherByCoordinatesMinutely15, getUserCoordinates } from '../scripts/weather'
import { detectConditions } from '../scripts/weatherConditions'

type AppAlert = {
    key: string
    msg: string
    timestamp: number
}

const ALERT_MESSAGE_BY_TAG: Record<string, string> = {
    'heavy-rain': '⚠️ Heavy rain expected',
    'high-wind': '⚠️ Strong winds expected',
    'extreme-heat': '⚠️ Heat stress risk',
    'extreme-cold': '⚠️ Cold exposure risk',
    mud: '⚠️ Muddy terrain likely',
    'ice-snow': '⚠️ Ice or snow risk',
}

const LOCAL_FORECAST_POINTS = 13
const TEST_COORDS = {
    latitude: 57.488238236046406,
    longitude: -5.279357046329361,
}

function toUnixTimestamp(time: string): number {
    const parsed = new Date(time).getTime()
    if (Number.isNaN(parsed)) {
        return Math.floor(Date.now() / 1000)
    }
    return Math.floor(parsed / 1000)
}

function AlertsPage() {
    const [alerts, setAlerts] = useState<AppAlert[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const generateAlertsForCoordinates = useCallback(async (coords: { latitude: number; longitude: number }) => {
        const weatherPoints = await fetchWeatherByCoordinatesMinutely15(
            Array(LOCAL_FORECAST_POINTS).fill(coords),
        )

        const tagFirstSeenAt = new Map<string, number>()
        let lowVisibilityTimestamp: number | null = null

        weatherPoints.forEach((point) => {
            const detected = detectConditions(point)
            const pointTimestamp = toUnixTimestamp(point.time)

            detected.tags.forEach((tag) => {
                if (!tagFirstSeenAt.has(tag)) {
                    tagFirstSeenAt.set(tag, pointTimestamp)
                }
            })

            if (point.visibility <= 1000 && lowVisibilityTimestamp === null) {
                lowVisibilityTimestamp = pointTimestamp
            }
        })

        const generatedAlerts: AppAlert[] = Array.from(tagFirstSeenAt.entries())
            .map(([tag, timestamp]) => {
                const baseMessage = ALERT_MESSAGE_BY_TAG[tag]
                if (!baseMessage) {
                    return null
                }

                return {
                    key: `local-${tag}`,
                    msg: `${baseMessage} near your current location`,
                    timestamp,
                }
            })
            .filter((alert): alert is AppAlert => alert !== null)

        if (lowVisibilityTimestamp !== null) {
            generatedAlerts.push({
                key: 'local-low-visibility',
                msg: '⚠️ Low visibility expected near your current location',
                timestamp: lowVisibilityTimestamp,
            })
        }

        generatedAlerts.sort((a, b) => b.timestamp - a.timestamp)
        setAlerts(generatedAlerts)
    }, [])

    const loadAlerts = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const userCoords = await getUserCoordinates()
            await generateAlertsForCoordinates(userCoords)
        } catch (caughtError) {
            const message = caughtError instanceof Error ? caughtError.message : 'Failed to generate alerts.'
            setError(message)
            setAlerts([])
        } finally {
            setIsLoading(false)
        }
    }, [generateAlertsForCoordinates])

    const runFixedLocationTest = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            await generateAlertsForCoordinates(TEST_COORDS)
        } catch (caughtError) {
            const message = caughtError instanceof Error ? caughtError.message : 'Failed to generate alerts.'
            setError(message)
            setAlerts([])
        } finally {
            setIsLoading(false)
        }
    }, [generateAlertsForCoordinates])

    useEffect(() => {
        loadAlerts()
    }, [loadAlerts])

    return (
        <div className="App">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <h1>Alerts</h1>
                <ThemeModeToggle />
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <button
                    type="button"
                    onClick={runFixedLocationTest}
                    disabled={isLoading}
                    style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid #ffffff50',
                        background: '#009DFF',
                        color: 'white',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        font: 'inherit',
                        transition: 'opacity 0.2s ease',
                    }}
                >
                    Run Test Location
                </button>
            </div>

            {isLoading && <p>Generating alerts...</p>}

            {!isLoading && error && (
                <div style={{ display: 'grid', gap: 8 }}>
                    <p role="alert" style={{ color: 'var(--accent)', margin: 0 }}>
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={loadAlerts}
                        style={{
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: '1px solid #ffffff50',
                            background: '#009DFF',
                            color: 'white',
                            cursor: 'pointer',
                            font: 'inherit',
                            transition: 'opacity 0.2s ease',
                            width: 'fit-content',
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !error && alerts.length > 0 && (
                <div className="items-list">
                    {alerts.map((alert) => (
                        <AlertItem key={alert.key} msg={alert.msg} timestamp={alert.timestamp} />
                    ))}
                </div>
            )}

            {!isLoading && !error && alerts.length === 0 && (
                <ImportPlaceholder icon={<BellIcon />} text="No weather risks detected near your current location" />
            )}
        </div>
    )
}

export default AlertsPage