export function formatTime(time: string): string {
  const isoTimeMatch = time.match(/T(\d{2}:\d{2})/)
  if (isoTimeMatch) {
    return isoTimeMatch[1]
  }

  const date = new Date(time)
  if (Number.isNaN(date.getTime())) {
    return time.length >= 16 ? time.slice(11, 16) : time
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(time: string): string {
    const date = new Date(time)
    if (Number.isNaN(date.getTime())) {
        return time.length >= 10 ? time.slice(0, 10) : time
    }
    return date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
}

export function formatValue(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString()
  }
  return value.toFixed(1)
}

export function formatDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}