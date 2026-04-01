type CacheEntry<T> = {
  data: T
  timestamp: number
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly TTL = 15 * 60 * 1000 // 15 minutes

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(): void {
    this.cache.clear()
  }
}

export const apiCache = new APICache()
