const { getGold } = require('../api/gold_api');
const cache = require('../utils/cache');

const CACHE_KEY = 'gold_data';

/**
 * Cache'lenmiş altın verilerini getir
 * @returns {Promise<Array>} Altın verileri
 */
async function getCachedGoldData() {
  // Önce cache'i kontrol et
  const cachedData = cache.get(CACHE_KEY);
  
  if (cachedData) {
    return cachedData;
  }
  
  // Cache yoksa API'den çek
  console.log('Altın verileri API\'den çekiliyor');
  const goldData = await getGold();
  
  // Cache'e kaydet
  cache.set(CACHE_KEY, goldData);
  
  return goldData;
}

/**
 * Cache'i temizle
 */
function clearGoldCache() {
  cache.clear(CACHE_KEY);
  console.log('Altın cache temizlendi');
}

module.exports = {
  getCachedGoldData,
  clearGoldCache
};