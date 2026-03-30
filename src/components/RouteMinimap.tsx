import { useEffect, useMemo, useState } from 'react'
import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet'
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type RouteMinimapProps = {
	gpxData: File | string | ArrayBuffer | null | undefined
	className?: string
	lineColor?: string
	lineWeight?: number
}

type ParseState = {
	points: LatLngTuple[]
	error: string | null
	loading: boolean
}

function getInitialCenter(points: LatLngTuple[]): LatLngTuple {
	if (points.length === 0) {
		return [0, 0]
	}

	return points[0]
}

function getBounds(points: LatLngTuple[]): LatLngBoundsExpression {
	return points.map((point) => [point[0], point[1]]) as LatLngBoundsExpression
}

function FitRouteBounds({ points }: { points: LatLngTuple[] }) {
	const map = useMap()

	useEffect(() => {
		if (points.length === 0) {
			return
		}

		const bounds = getBounds(points)
		const mapSize = map.getSize()

		map.fitBounds(bounds, {
			animate: false,
			paddingTopLeft: [8, 8],
			paddingBottomRight: [8, 18],
			maxZoom: 19,
		})

		// Re-apply fit with height-biased padding for wide containers where height is the limiting side.
		if (mapSize.x > mapSize.y) {
			const verticalPadding = Math.round(Math.max(10, mapSize.y * 0.07))
			map.fitBounds(bounds, {
				animate: false,
				paddingTopLeft: [8, verticalPadding],
				paddingBottomRight: [8, verticalPadding + 10],
				maxZoom: 19,
			})
		}
	}, [map, points])

	return null
}

function parseGpxTrackPoints(gpxXml: string): LatLngTuple[] {
	const parser = new DOMParser()
	const xmlDoc = parser.parseFromString(gpxXml, 'application/xml')
	const parserError = xmlDoc.querySelector('parsererror')

	if (parserError) {
		throw new Error('Invalid GPX XML content.')
	}

	const pointElements = xmlDoc.querySelectorAll('trkpt, rtept, wpt')
	const points: LatLngTuple[] = []

	pointElements.forEach((pointElement) => {
		const lat = Number(pointElement.getAttribute('lat'))
		const lng = Number(pointElement.getAttribute('lon'))

		if (Number.isFinite(lat) && Number.isFinite(lng)) {
			points.push([lat, lng])
		}
	})

	return points
}

async function readGpxAsText(gpxData: RouteMinimapProps['gpxData']): Promise<string> {
	if (!gpxData) {
		throw new Error('No GPX data provided.')
	}

	if (typeof gpxData === 'string') {
		return gpxData
	}

	if (gpxData instanceof ArrayBuffer) {
		return new TextDecoder('utf-8').decode(gpxData)
	}

	return gpxData.text()
}

export default function RouteMinimap({
	gpxData,
	className,
	lineColor = '#2563eb',
	lineWeight = 4,
}: RouteMinimapProps) {
	const [parseState, setParseState] = useState<ParseState>({
		points: [],
		error: null,
		loading: false,
	})

	useEffect(() => {
		let cancelled = false

		if (!gpxData) {
			setParseState({ points: [], error: null, loading: false })
			return
		}

		setParseState((previous) => ({ ...previous, loading: true, error: null }))

		readGpxAsText(gpxData)
			.then((gpxText) => {
				if (cancelled) {
					return
				}

				const points = parseGpxTrackPoints(gpxText)

				if (points.length === 0) {
					setParseState({
						points: [],
						loading: false,
						error: 'No route points found in this GPX file.',
					})
					return
				}

				setParseState({ points, loading: false, error: null })
			})
			.catch((err) => {
				if (cancelled) {
					return
				}
				console.error('RouteMinimap parse error:', err)
				setParseState({
					points: [],
					loading: false,
					error: 'Unable to parse the GPX data.',
				})
			})

		return () => {
			cancelled = true
		}
	}, [gpxData])

	const center = useMemo(() => getInitialCenter(parseState.points), [parseState.points])

	if (parseState.error) {
		return (
			<div
				className={className}
				style={{
					width: '100%',
					height: '100%',
					minHeight: 160,
					borderRadius: 12,
					backgroundColor: '#f8fafc',
					border: '1px solid #e2e8f0',
					display: 'grid',
					placeItems: 'center',
					color: '#334155',
					fontSize: 14,
					textAlign: 'center',
					padding: 16,
					boxSizing: 'border-box',
				}}
			>
				{parseState.error}
			</div>
		)
	}

	if (parseState.loading) {
		return (
			<div
				className={className}
				style={{
					width: '100%',
					height: '100%',
					minHeight: 160,
					borderRadius: 12,
					backgroundColor: '#f8fafc',
					border: '1px solid #e2e8f0',
					display: 'grid',
					placeItems: 'center',
					color: '#334155',
					fontSize: 14,
				}}
			>
				Loading GPX route...
			</div>
		)
	}

	if (parseState.points.length === 0) {
		return (
			<div
				className={className}
				style={{
					width: '100%',
					height: '100%',
					// minHeight: 160,
					borderRadius: '0px 12px',
					backgroundColor: '#f8fafc',
					border: '1px dashed #cbd5e1',
					display: 'grid',
					placeItems: 'center',
					color: '#64748b',
					fontSize: 14,
				}}
			>
				Error loading GPX Route preview
			</div>
		)
	}

	return (
		<div
			className={className}
			style={{
				width: '100%',
				height: '100%',
				// minHeight: 160,
                borderRadius: '0px 12px',
				overflow: 'hidden',
				border: '1px solid #dbe3f0',
			}}
		>
			<MapContainer
				center={center}
				zoom={13}
				style={{ width: '100%', height: '100%' }}
				zoomControl={false}
				scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
			>
				<TileLayer
					attribution='&copy; OpenStreetMap contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				<Polyline positions={parseState.points} pathOptions={{ color: lineColor, weight: lineWeight }} />
				<FitRouteBounds points={parseState.points} />
			</MapContainer>
		</div>
	)
}
