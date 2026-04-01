import type { WeatherData } from '../scripts/weather'
import { useState } from 'react'
import { recommendEquipmentForWeather } from '../scripts/equipmentRecommend'
import './WeatherForecastPanel.css'

type WeatherForecastPanelProps = {
  weatherData: WeatherData[]
  selectedStartDateTime?: string
}

type MetricKey =
  | 'temperature_2m'
  | 'apparent_temperature'
  | 'elevation'
  | 'relative_humidity_2m'
  | 'dew_point_2m'
  | 'precipitation'
  | 'snowfall'
  | 'rain'
  | 'showers'
  | 'wind_speed_10m'
  | 'wind_direction_10m'
  | 'wind_gusts_10m'
  | 'visibility'

type MetricDefinition = {
  key: MetricKey
  label: string
  unit: string
  dashArray?: string
}

type ChartGroup = {
  id: string
  title: string
  metrics: MetricDefinition[]
}

const chartGroups: ChartGroup[] = [
  {
    id: 'temp',
    title: 'Temperature + Apparent',
    metrics: [
      { key: 'temperature_2m', label: 'Temperature', unit: '°C' },
      { key: 'apparent_temperature', label: 'Apparent', unit: '°C', dashArray: '16 8' },
    ],
  },
  {
    id: 'elevation',
    title: 'Elevation',
    metrics: [{ key: 'elevation', label: 'Elevation', unit: 'm' }],
  },
  {
    id: 'humidity',
    title: 'Humidity + Dew Point',
    metrics: [
      { key: 'relative_humidity_2m', label: 'Humidity', unit: '%' },
      { key: 'dew_point_2m', label: 'Dew point', unit: '°C', dashArray: '16 8' },
    ],
  },
  {
    id: 'precipitation',
    title: 'Precipitation + Snowfall + Rain + Showers',
    metrics: [
      { key: 'precipitation', label: 'Precipitation', unit: 'mm' },
      { key: 'snowfall', label: 'Snowfall', unit: 'cm', dashArray: '16 8' },
      { key: 'rain', label: 'Rain', unit: 'mm', dashArray: '6 8' },
      { key: 'showers', label: 'Showers', unit: 'mm', dashArray: '20 8' },
    ],
  },
  {
    id: 'wind',
    title: 'Wind Speed + Direction + Gusts',
    metrics: [
      { key: 'wind_speed_10m', label: 'Speed', unit: 'km/h' },
      { key: 'wind_direction_10m', label: 'Direction', unit: '°', dashArray: '16 8' },
      { key: 'wind_gusts_10m', label: 'Gusts', unit: 'km/h', dashArray: '6 8' },
    ],
  },
  {
    id: 'visibility',
    title: 'Visibility',
    metrics: [{ key: 'visibility', label: 'Visibility', unit: 'm' }],
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

function formatPickedDateTime(time?: string): { date: string; time: string } {
  if (!time) {
    return { date: 'Now', time: '-' }
  }

  const date = new Date(time)
  if (Number.isNaN(date.getTime())) {
    return {
      date: time.length >= 10 ? time.slice(0, 10) : time,
      time: time.length >= 16 ? time.slice(11, 16) : '-',
    }
  }

  return {
    date: date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

function formatValue(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString()
  }
  return value.toFixed(1)
}

function buildTickIndexes(length: number): number[] {
  if (length <= 1) {
    return [0]
  }

  const tickCount = length;
  const indexes = Array.from({ length: tickCount }, (_, index) =>
    Math.round((index * (length - 1)) / (tickCount - 1)),
  )

  return Array.from(new Set(indexes))
}

function getSeriesToneOpacity(index: number): number {
  const opacities = [1, 0.64, 0.42, 0.27]
  return opacities[index] ?? 0.2
}

export default function WeatherForecastPanel({ weatherData, selectedStartDateTime }: WeatherForecastPanelProps) {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0)

  if (weatherData.length === 0) {
    return <section className="weather-panel">No weather data available.</section>
  }

  const current = weatherData[0]
  const forecast = weatherData.slice(0)
  const equipmentRecommendation = recommendEquipmentForWeather(weatherData)
  const activeGroup = chartGroups[activeGroupIndex]
  const duration = 0.25*(weatherData.length-1)
  const durationHours = Math.floor(duration)
  const durationMinutes = Math.round((duration - durationHours) * 60).toString().padStart(2, '0')
  const pickedStart = formatPickedDateTime(selectedStartDateTime)

  const FIXED_X_STEP = 120
  const chartHeight = 450
  const labelTopStart = 20
  const labelRowStep = 28
  const paddingTop = 26 + activeGroup.metrics.length * labelRowStep
  const paddingRight = 20
  const paddingBottom = 34
  const paddingLeft = 20

  const forecastLength = forecast.length
  const minChartWidth = 960
  const minDrawableWidth = minChartWidth - paddingLeft - paddingRight
  const requiredDrawableWidth = forecastLength > 1 ? (forecastLength - 1) * FIXED_X_STEP : minDrawableWidth
  const drawableWidth = Math.max(minDrawableWidth, requiredDrawableWidth)
  const chartWidth = drawableWidth + paddingLeft + paddingRight
  const drawableHeight = chartHeight - paddingTop - paddingBottom

  const xStep = forecastLength > 1 ? FIXED_X_STEP : 0

  const unitScaleMap = new Map<string, { min: number; max: number; range: number }>()
  activeGroup.metrics.forEach((metric) => {
    let values = forecast.map((entry) => entry[metric.key])
    let unit = metric.unit
    
    if (metric.key === 'snowfall') {
      values = values.map((v) => v * 10)
      unit = 'mm'
    }
    
    const unitScale = unitScaleMap.get(unit)

    if (!unitScale) {
      const min = Math.min(...values)
      const max = Math.max(...values)
      unitScaleMap.set(unit, { min, max, range: max - min })
      return
    }

    const nextMin = Math.min(unitScale.min, ...values)
    const nextMax = Math.max(unitScale.max, ...values)
    unitScaleMap.set(unit, { min: nextMin, max: nextMax, range: nextMax - nextMin })
  })

  const series = activeGroup.metrics.map((metric) => {
    const values = forecast.map((entry) => entry[metric.key])
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    
    let unit = metric.unit
    let normalizedValues = values
    if (metric.key === 'snowfall') {
      normalizedValues = values.map((v) => v * 10)
      unit = 'mm'
    }
    
    const unitScale = unitScaleMap.get(unit) ?? { min: normalizedValues[0] ?? 0, max: normalizedValues[0] ?? 0, range: 0 }

    const points = forecast.map((entry, index) => {
      const value = entry[metric.key]
      const normalizedValue = metric.key === 'snowfall' ? value * 10 : value
      const normalized =
        range === 0
          ? unitScale.range === 0
            ? 0.5
            : (normalizedValue - unitScale.min) / unitScale.range
          : (value - min) / range
      const x = paddingLeft + index * xStep
      const y = paddingTop + (1 - normalized) * drawableHeight
      return { x, y, value }
    })

    return {
      ...metric,
      points,
    }
  })

  const pointSignature = (values: { x: number; y: number }[]) =>
    values.map((point) => `${point.x.toFixed(2)}:${point.y.toFixed(2)}`).join('|')

  const seriesOffsets = new Array(series.length).fill(0)
  const overlappingSeries = new Map<string, number[]>()

  series.forEach((metric, metricIndex) => {
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
  series.forEach((metric, index) => {
    seriesOffsetByKey.set(metric.key, seriesOffsets[index])
  })

  const tickIndexes = buildTickIndexes(forecastLength)
  const isFirstSlide = activeGroupIndex === 0
  const isLastSlide = activeGroupIndex === chartGroups.length - 1

  return (
    <section className="weather-panel">
      <div className="weather-panel-current" aria-label="Current weather">
        <div className="weather-panel-current-temp">
          {formatValue(current.temperature_2m)}°C
        </div>
        <div className="weather-panel-current-label">
          {current.weather_label}
        </div>

        <div className="weather-panel-picked-start" aria-label="Selected run start time">
          Selected start: <strong>{pickedStart.date} {pickedStart.time}</strong>
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

        <div className="weather-panel-recommendations" aria-label="Equipment recommendations">
          <h4 className="weather-panel-recommendations-title">Equipment recommendations (for the next {durationHours}:{durationMinutes} hours)</h4>

          {/* {equipmentRecommendation.conditions.length > 0 && (
            <ul className="weather-panel-recommendations-conditions">
              {equipmentRecommendation.conditions.map((condition, index) => (
                <li key={`${condition}-${index}`}>{condition}</li>
              ))}
            </ul>
          )} */}

          <div className="weather-panel-recommendations-groups">
            <div>
              <p className="weather-panel-recommendations-subtitle">Must-have</p>
              {equipmentRecommendation.mustHave.length === 0 ? (
                <p className="weather-panel-recommendations-empty">No must-have items.</p>
              ) : (
                <ul className="weather-panel-recommendations-list">
                  {equipmentRecommendation.mustHave.map((item) => (
                    <li key={item.id}>{item.label}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="weather-panel-recommendations-subtitle">Nice-to-have</p>
              {equipmentRecommendation.niceToHave.length === 0 ? (
                <p className="weather-panel-recommendations-empty">No nice-to-have items.</p>
              ) : (
                <ul className="weather-panel-recommendations-list">
                  {equipmentRecommendation.niceToHave.map((item) => (
                    <li key={item.id}>{item.label}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="weather-panel-chart" aria-label="Forecast chart">
        <div className="weather-panel-slider" aria-label="Forecast chart groups slider">
          <div className="weather-panel-slider-top">
            <button
              type="button"
              className="weather-panel-slider-button"
              onClick={() => setActiveGroupIndex((value) => Math.max(0, value - 1))}
              disabled={isFirstSlide}
            >
              {'<'}
            </button>
            <div className="weather-panel-slider-title-wrap">
              <h3 className="weather-panel-slider-title">{activeGroup.title}</h3>
              <p className="weather-panel-slider-step">
                {activeGroupIndex + 1} / {chartGroups.length}
              </p>
            </div>
            <button
              type="button"
              className="weather-panel-slider-button"
              onClick={() =>
                setActiveGroupIndex((value) => Math.min(chartGroups.length - 1, value + 1))
              }
              disabled={isLastSlide}
            >
              {'>'}
            </button>
          </div>

          <div className="weather-panel-slider-dots" aria-hidden="true">
            {chartGroups.map((group, index) => (
              <span
                key={group.id}
                className={`weather-panel-slider-dot ${index === activeGroupIndex ? 'is-active' : ''}`}
              />
            ))}
          </div>

          {forecastLength === 0 ? (
            <p className="weather-panel-empty">No forecast points after current weather.</p>
          ) : (
            <div className="weather-panel-slider-content">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="weather-panel-chart-svg"
                role="img"
                aria-label={`${activeGroup.title} forecast chart`}
              >
                <line
                  x1={paddingLeft}
                  y1={chartHeight - paddingBottom}
                  x2={chartWidth - paddingRight}
                  y2={chartHeight - paddingBottom}
                  className="weather-panel-axis"
                />

                {series.map((metric, seriesIndex) => {
                  const seriesOffset = seriesOffsetByKey.get(metric.key) ?? 0
                  const toneOpacity = getSeriesToneOpacity(seriesIndex)
                  const labelY = labelTopStart + seriesIndex * labelRowStep

                  return (
                    <g key={metric.key}>
                      <polyline
                        points={metric.points
                          .map((point) => `${point.x},${point.y + seriesOffset}`)
                          .join(' ')}
                        fill="none"
                        stroke="var(--text-h)"
                        strokeOpacity={toneOpacity}
                        strokeWidth="5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeDasharray={metric.dashArray}
                      />
                      {metric.points.map((point, index) => (
                        <g key={`${metric.key}-${index}`}>
                          {(() => {
                            const labelText = formatValue(point.value)
                            const labelWidth = Math.max(26, labelText.length * 8 + 8)

                            return (
                              <rect
                                x={point.x - labelWidth / 2}
                                y={labelY - 9}
                                width={labelWidth}
                                height={18}
                                rx={4}
                                className="weather-panel-point-label-bg"
                              />
                            )
                          })()}
                          <circle
                            cx={point.x}
                            cy={point.y + seriesOffset}
                            r="5"
                            fill="var(--text-h)"
                            fillOpacity={toneOpacity}
                            className="weather-panel-point-dot"
                          />
                          <text
                            x={point.x}
                            y={labelY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="weather-panel-point-label"
                            fillOpacity={toneOpacity}
                          >
                            {formatValue(point.value)}
                          </text>
                        </g>
                      ))}
                    </g>
                  )
                })}

                {tickIndexes.map((tickIndex) => {
                  const x = paddingLeft + tickIndex * xStep
                  const y = chartHeight - paddingBottom
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
}