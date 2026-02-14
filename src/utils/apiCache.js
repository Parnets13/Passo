/**
 * Simple in-memory cache for API responses
 * Reduces unnecessary API calls and improves performance
 */

class APICache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  /**
   * Get cached data if available and not expired
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in milliseconds
   * @returns {any|null} Cached data or null if expired/not found
   */
  get(key, ttl = 5 * 60 * 1000) { // Default 5 minutes
    const data = this.cache.get(key);
    const timestamp = this.timestamps.get(key);

    if (!data || !timestamp) {
      return null;
    }

    const now = Date.now();
    const age = now - timestamp;

    if (age > ttl) {
      // Cache expired, remove it
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    console.log(`📦 Cache HIT for ${key} (age: ${Math.round(age / 1000)}s)`);
    return data;
  }

  /**
   * Set cache data
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  set(key, data) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
    console.log(`💾 Cache SET for ${key}`);
  }

  /**
   * Invalidate specific cache key
   * @param {string} key - Cache key to invalidate
   */
  invalidate(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
    console.log(`🗑️ Cache INVALIDATED for ${key}`);
  }

  /**
   * Invalidate all cache keys matching a pattern
   * @param {string} pattern - Pattern to match (e.g., 'categories')
   */
  invalidatePattern(pattern) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        count++;
      }
    }
    console.log(`🗑️ Cache INVALIDATED ${count} keys matching '${pattern}'`);
  }

  /**
   * Clear all cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.timestamps.clear();
    console.log(`🗑️ Cache CLEARED (${size} items removed)`);
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      oldestEntry: this.getOldestEntry(),
      newestEntry: this.getNewestEntry()
    };
  }

  /**
   * Get oldest cache entry age
   * @returns {number|null} Age in milliseconds
   */
  getOldestEntry() {
    let oldest = null;
    const now = Date.now();

    for (const timestamp of this.timestamps.values()) {
      const age = now - timestamp;
      if (oldest === null || age > oldest) {
        oldest = age;
      }
    }

    return oldest;
  }

  /**
   * Get newest cache entry age
   * @returns {number|null} Age in milliseconds
   */
  getNewestEntry() {
    let newest = null;
    const now = Date.now();

    for (const timestamp of this.timestamps.values()) {
      const age = now - timestamp;
      if (newest === null || age < newest) {
        newest = age;
      }
    }

    return newest;
  }
}

// Create singleton instance
const apiCache = new APICache();

// Export cache instance and helper functions
export default apiCache;

/**
 * Wrapper function to cache API calls
 * @param {string} key - Cache key
 * @param {Function} apiCall - API call function
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<any>} API response
 */
export async function cachedAPICall(key, apiCall, ttl = 5 * 60 * 1000) {
  // Try to get from cache first
  const cached = apiCache.get(key, ttl);
  if (cached !== null) {
    return cached;
  }

  // Cache miss, make API call
  console.log(`🌐 Cache MISS for ${key}, fetching from API...`);
  const response = await apiCall();
  
  // Store in cache
  apiCache.set(key, response);
  
  return response;
}

/**
 * Cache configuration presets
 */
export const CacheTTL = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000  // 1 hour
};
