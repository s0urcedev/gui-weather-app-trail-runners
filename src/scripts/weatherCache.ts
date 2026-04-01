type CacheEntry<T> = {
  data: T
  timestamp: number
}

class APICache {
  private readonly TTL = 15 * 60 * 1000 // 15 minutes
  private readonly prefix = 'cache_'

  set<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry))
    } catch (e) {
      console.warn('Failed to write to localStorage:', e)
    }
  }

  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.prefix + key)
      if (!stored) return null

      const entry: CacheEntry<T> = JSON.parse(stored)

      // Check if expired
      if (Date.now() - entry.timestamp > this.TTL) {
        localStorage.removeItem(this.prefix + key)
        return null
      }

      return entry.data
    } catch (e) {
      console.warn('Failed to read from localStorage:', e)
      return null
    }
  }

  clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }
}

export const apiCache = new APICache()
