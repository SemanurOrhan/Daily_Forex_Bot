/**
 * Basit in-memory cache yöneticisi
 */
class CacheManager {
  constructor(duration = 10 * 60 * 1000) { // Varsayılan 10 dakika (rate limit için arttırdık)
    this.cache = new Map();
    this.duration = duration;
  }

  /**
   * Cache'e veri ekle
   * @param {string} key - Cache anahtarı
   * @param {*} data - Saklanacak veri
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`Cache set: ${key}`);
  }

  /**
   * Cache'den veri al
   * @param {string} key - Cache anahtarı
   * @returns {*} Cached data veya null
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      console.log(`Cache miss: ${key}`);
      return null;
    }

    const now = Date.now();
    const age = now - cached.timestamp;
    const isExpired = age > this.duration;

    if (isExpired) {
      console.log(`Cache expired: ${key} (age: ${Math.round(age / 1000)}s)`);
      this.cache.delete(key);
      return null;
    }

    console.log(`Cache hit: ${key} (age: ${Math.round(age / 1000)}s)`);
    return cached.data;
  }

  /**
   * Cache'i temizle
   * @param {string} key - Cache anahtarı (opsiyonel, yoksa tümünü temizler)
   */
  clear(key = null) {
    if (key) {
      this.cache.delete(key);
      console.log(`Cache cleared: ${key}`);
    } else {
      this.cache.clear();
      console.log('All cache cleared');
    }
  }

  /**
   * Cache durumunu göster
   */
  status() {
    console.log('Cache status:');
    for (const [key, value] of this.cache.entries()) {
      const age = Math.round((Date.now() - value.timestamp) / 1000);
      console.log(`  ${key}: ${age}s old`);
    }
  }
}

module.exports = new CacheManager();