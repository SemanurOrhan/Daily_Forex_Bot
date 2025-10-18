const { getCrypto } = require('../api/crypto_api');
const cache = require('../utils/cache');

const CACHE_KEY = 'crypto_data';

/**
 * Cache'lenmiş kripto para verilerini getir
 * @returns {Promise<Array>} Kripto para verileri
 */
async function getCachedCryptoData() {
  const cachedData = cache.get(CACHE_KEY);
  
  if (cachedData) {
    console.log('Kripto verileri cache\'den alındı');
    return cachedData;
  }
  
  console.log('Kripto verileri API\'den çekiliyor');
  const cryptoData = await getCrypto();
  
  cache.set(CACHE_KEY, cryptoData);
  
  return cryptoData;
}

/**
 * Popüler kripto paraları filtrele
 * @param {Array} cryptoData - Tüm kripto veriler
 * @returns {Array} Filtrelenmiş kripto veriler
 */
function getPopularCryptos(cryptoData) {
  const popularCodes = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'ADA', 'DOGE', 'SOL'];
  return cryptoData.filter(crypto => popularCodes.includes(crypto.code));
}

/**
 * Belirli bir kripto parayı bul
 * @param {Array} cryptoData - Tüm kripto veriler
 * @param {string} code - Kripto kodu
 * @returns {Object|null} Kripto verisi veya null
 */
function findCrypto(cryptoData, code) {
  return cryptoData.find(crypto => crypto.code.toUpperCase() === code.toUpperCase());
}

/**
 * Cache'i temizle
 */
function clearCryptoCache() {
  cache.clear(CACHE_KEY);
  console.log('Kripto cache temizlendi');
}

module.exports = {
  getCachedCryptoData,
  getPopularCryptos,
  findCrypto,
  clearCryptoCache
};