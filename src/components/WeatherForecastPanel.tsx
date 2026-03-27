import type { WeatherData } from '../scripts/weather'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import './WeatherForecastPanel.css'

type WeatherForecastPanelProps = {
  weatherData: WeatherData[]
}

type MetricKey =
  | 'temperature_2m'
  | 'apparent_temperature'
  | 'elevation'
  | 'relative_humidity_2m'
  | 'precipitation'
  | 'wind_speed_10m'
  | 'visibility'

type MetricConfig = {
  key: MetricKey
  label: string
  unit: string
  color: string
  dashArray?: string
}

const metricConfig: MetricConfig[] = [
  { key: 'temperature_2m', label: 'Temperature', unit: '°C', color: '#ef4444' },
  {
    key: 'apparent_temperature',
    label: 'Apparent',
    unit: '°C',
    color: '#3b82f6',
    dashArray: '7 4',
  },
  {
    key: 'elevation',
    label: 'Elevation',
    unit: 'm',
    color: '#22c55e',
    dashArray: '3 3',
  },
  {
    key: 'relative_humidity_2m',
    label: 'Humidity',
    unit: '%',
    color: '#f97316',
    dashArray: '10 5',
  },
  {
    key: 'precipitation',
    label: 'Precipitation',
    unit: 'mm',
    color: '#eab308',
    dashArray: '2 4',
  },
  {
    key: 'wind_speed_10m',
    label: 'Wind speed',
    unit: 'km/h',
    color: '#a855f7',
    dashArray: '9 3 2 3',
  },
  {
    key: 'visibility',
    label: 'Visibility',
    unit: 'm',
    color: '#06b6d4',
    dashArray: '12 4',
  },
]

function formatTime(time: string): string {
  const date = new Date(time)
  if (Number.isNaN(date.getTime())) {
    return time.length >= 16 ? time.slice(11, 16) : time
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(time: string): string {
    const date = new Date(time)
    if (Number.isNaN(date.getTime())) {
        return time.length >= 10 ? time.slice(0, 10) : time
    }
    return date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
}

function formatValue(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString()
  }
  return value.toFixed(1)
}

export default function WeatherForecastPanel({ weatherData }: WeatherForecastPanelProps) {
  const [enabledMetrics, setEnabledMetrics] = useState<Record<MetricKey, boolean>>(() => ({
    temperature_2m: true,
    apparent_temperature: true,
    elevation: true,
    relative_humidity_2m: true,
    precipitation: true,
    wind_speed_10m: true,
    visibility: true,
  }))

  if (weatherData.length === 0) {
    return <section className="weather-panel">No weather data available.</section>
  }

  const current = weatherData[0]
  const forecast = weatherData.slice(1)

  const chartWidth = 980
  const chartHeight = 400
  const paddingTop = -20
  const paddingRight = 40
  const paddingBottom = 0
  const paddingLeft = 40
  const drawableWidth = chartWidth - paddingLeft - paddingRight
  const drawableHeight = chartHeight - paddingTop - paddingBottom

  const forecastLength = forecast.length
  const xStep = forecastLength > 1 ? drawableWidth / (forecastLength - 1) : 0

  const series = metricConfig.map((metric) => {
    const values = forecast.map((entry) => entry[metric.key])
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min

    const points = forecast.map((entry, index) => {
      const value = entry[metric.key]
      const normalized = range === 0 ? 0.5 : (value - min) / range
      const x = paddingLeft + index * xStep
      const y = paddingTop + (1 - normalized) * drawableHeight
      return { x, y, value }
    })

    return {
      ...metric,
      points,
    }
  })

  const enabledSeries = series.filter((metric) => enabledMetrics[metric.key])

  const pointSignature = (values: { x: number; y: number }[]) =>
    values.map((point) => `${point.x.toFixed(2)}:${point.y.toFixed(2)}`).join('|')

  const seriesOffsets = new Array(enabledSeries.length).fill(0)
  const overlappingSeries = new Map<string, number[]>()

  enabledSeries.forEach((metric, metricIndex) => {
    const signature = pointSignature(metric.points)
    const indexes = overlappingSeries.get(signature) ?? []
    indexes.push(metricIndex)
    overlappingSeries.set(signature, indexes)
  })

  overlappingSeries.forEach((indexes) => {
    if (indexes.length < 2) {
      return
    }

    indexes.forEach((metricIndex, indexInGroup) => {
      const centeredIndex = indexInGroup - (indexes.length - 1) / 2
      seriesOffsets[metricIndex] = centeredIndex * 4
    })
  })

  const seriesOffsetByKey = new Map<MetricKey, number>()
  enabledSeries.forEach((metric, index) => {
    seriesOffsetByKey.set(metric.key, seriesOffsets[index])
  })

  const tickCount = forecastLength
  const tickIndexes =
    tickCount <= 1
      ? [0]
      : Array.from({ length: tickCount }, (_, index) =>
          Math.round((index * (forecastLength - 1)) / (tickCount - 1)),
        )

  const valuesGridStyle = {
    ['--forecast-columns' as string]: String(Math.max(1, forecastLength)),
  } as CSSProperties

  return (
    <section className="weather-panel">
      <div className="weather-panel-current" aria-label="Current weather">
        <div className="weather-panel-current-temp">
          {formatValue(current.temperature_2m)}°C
        </div>
        <div className="weather-panel-current-label">
          {current.weather_label}
        </div>

        <div className="weather-panel-current-metrics">
          <div>
            <div>Apparent:</div><div><strong>{formatValue(current.apparent_temperature)}°C</strong></div>
          </div>
          <div>
            <div>Elevation:</div><div><strong>{formatValue(current.elevation)} m</strong></div>
          </div>
          <div>
            <div>Humidity:</div><div><strong>{formatValue(current.relative_humidity_2m)}%</strong></div>
          </div>
          <div>
            <div>Precipitation:</div><div><strong>{formatValue(current.precipitation)} mm</strong></div>
          </div>
          <div>
            <div>Wind speed:</div><div><strong>{formatValue(current.wind_speed_10m)} km/h</strong></div>
          </div>
          <div>
            <div>Visibility:</div><div><strong>{formatValue(current.visibility)} m</strong></div>
          </div>
          <div>
            <div>Date:</div><div><strong>{formatDate(current.time)}</strong></div>
          </div>
          <div>
            <div>Time:</div><div><strong>{formatTime(current.time)}</strong></div>
          </div>
        </div>
      </div>

      <div className="weather-panel-chart" aria-label="Forecast chart">
        {forecastLength === 0 ? (
          <p className="weather-panel-empty">No forecast points after current weather.</p>
        ) : (
          <>
            <div className="weather-panel-controls" aria-label="Graph variable toggles">
              {metricConfig.map((metric) => (
                <label key={`${metric.key}-toggle`} className="weather-panel-control-item">
                  <input
                    type="checkbox"
                    checked={enabledMetrics[metric.key]}
                    onChange={(event) => {
                      const isChecked = event.target.checked
                      setEnabledMetrics((previous) => ({
                        ...previous,
                        [metric.key]: isChecked,
                      }))
                    }}
                    style={{ accentColor: metric.color }}
                  />
                  {/* <span className="weather-panel-control-color" style={{ backgroundColor: metric.color }} aria-hidden="true" /> */}
                  <span style={{ color: metric.color }}>{metric.label} ({metric.unit})</span>
                </label>
              ))}
            </div>

            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="weather-panel-chart-svg"
              role="img"
              aria-label="Forecast chart for temperature, apparent temperature, elevation, humidity, precipitation, wind speed, and visibility"
            >
              <line
                x1={paddingLeft}
                y1={chartHeight - paddingBottom}
                x2={chartWidth - paddingRight}
                y2={chartHeight - paddingBottom}
                className="weather-panel-axis"
              />

              {enabledSeries.map((metric) => {
                const seriesOffset = seriesOffsetByKey.get(metric.key) ?? 0

                return (
                <g key={metric.key}>
                  <polyline
                    points={metric.points.map((point) => `${point.x},${point.y + seriesOffset}`).join(' ')}
                    fill="none"
                    stroke={metric.color}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeDasharray={metric.dashArray}
                  />
                  {metric.points.map((point, index) => (
                    <g key={`${metric.key}-${index}`}>
                      <circle cx={point.x} cy={point.y + seriesOffset} r="2.8" fill={metric.color} />
                    </g>
                  ))}
                </g>
                )
              })}

              {tickIndexes.map((tickIndex) => {
                const x = paddingLeft + tickIndex * xStep
                const y = 10 + chartHeight - paddingBottom
                return (
                  <g key={`tick-${tickIndex}`}>
                    <line x1={x} y1={y} x2={x} y2={y + 6} className="weather-panel-axis" />
                    <text x={x} y={y + 22} textAnchor="middle" className="weather-panel-x-label">
                      {formatTime(forecast[tickIndex].time)}
                    </text>
                  </g>
                )
              })}
            </svg>

            {enabledSeries.length === 0 && (
              <p className="weather-panel-empty">Enable at least one variable to show graph lines.</p>
            )}

            <div
              className="weather-panel-values"
              aria-label="Forecast values by metric"
              style={valuesGridStyle}
            >
              {enabledSeries.map((metric) => (
                <div key={`${metric.key}-values`} className="weather-panel-values-row">
                  <div className="weather-panel-values-list" style={{ color: metric.color }}>
                    {metric.points.map((point, index) => (
                      <span key={`${metric.key}-value-${index}`} className="weather-panel-point-value">
                        {formatValue(point.value)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}