import { useEffect, useState } from 'react'
import './AlertItem.css'
import ClockIcon from './icons/ClockIcon'

type AlertItemProps = {
    msg: string;
    timestamp: number;
}

export function AlertItem({ msg, timestamp }: AlertItemProps) {
    const [nowMs, setNowMs] = useState(() => Date.now())

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setNowMs(Date.now())
        }, 1000)

        return () => {
            window.clearInterval(intervalId)
        }
    }, [])

    const timestampMs = timestamp * 1000
    const minutesAgo = Math.max(0, (nowMs - timestampMs) / 60_000)
    const isWithinTwoMinutes = minutesAgo <= 2

    const formatAbsoluteTimestamp = (valueMs: number) => {
        const date = new Date(valueMs)
        const weekday = date.toLocaleString('en-US', { weekday: 'short' })
        const day = date.getDate()
        const month = date.toLocaleString('en-US', { month: 'short' })
        const year = date.getFullYear()
        const time = date
            .toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            .replace(' ', '')

        return `${weekday} ${day} ${month} ${year}, ${time}`
    }

    const relativeTimeLabel = (() => {
        const hours = Math.floor(minutesAgo / 60)
        const minutes = Math.floor(minutesAgo % 60)

        if (hours === 0) {
            if (minutes === 0) {
                return 'Just Now'
            }

            return `${minutes}m ago`
        }

        return `${hours}h ${minutes}m ago`
    })()

    const timeLabel = minutesAgo < 24 * 60
        ? relativeTimeLabel
        : formatAbsoluteTimestamp(timestampMs)

    return (
        <article className={`alert${isWithinTwoMinutes ? ' alert-blue-outline' : ''}`}>
            <h2 className="alert-msg">{msg}</h2>
            <div className="alert-time-holder">
                <ClockIcon size={14} strokeWidth={1} className="trail-item-metric-icon" />
                <span>{timeLabel}</span>
            </div>
        </article>
    )
}
