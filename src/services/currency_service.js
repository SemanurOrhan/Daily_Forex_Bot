const { getSingleCurrency } = require('../api/currency_api');
const cache = require('../utils/cache');

const CACHE_KEY_PREFIX = 'currency_';
const REQUEST_DELAY = 1000; // İstekler arasında 1 saniye bekle

/**
 * Belirli bir süre bekle
 * @param {number} ms - Milisaniye
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * USD ve EUR kurlarını getir (cache'li)
 * @returns {Promise<Array>} Para birimi verileri
 */
async function getMainCurrencies() {
  const cacheKey = `${CACHE_KEY_PREFIX}main`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  console.log('Ana döviz verileri API\'den çekiliyor');
  
  try {
    // USD kurunu çek
    const usdData = await getSingleCurrency('USD', 1);
    
    // Rate limit için bekle
    await delay(REQUEST_DELAY);
    
    // EUR kurunu çek
    const eurData = await getSingleCurrency('EUR', 1);
    
    const result = [
      { code: 'USD', name: 'US Dollar', rate: usdData.rate },
      { code: 'EUR', name: 'Euro', rate: eurData.rate }
    ];
    
    // Cache'e kaydet
    cache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Ana döviz verileri çekilirken hata:', error);
    
    // 429 hatası için özel mesaj
    if (error.response && error.response.status === 429) {
      throw new Error('API istek limiti aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
    }
    
    throw error;
  }
}

/**
 * Belirli bir para biriminin TRY kurunu getir
 * @param {string} currency - Para birimi kodu
 * @param {number} amount - Miktar (varsayılan: 1)
 * @returns {Promise<Object>} Para birimi verisi
 */
async function getCurrencyRate(currency, amount = 1) {
  const cacheKey = `${CACHE_KEY_PREFIX}${currency}_${amount}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  console.log(`${currency} verisi API'den çekiliyor`);
  
  try {
    const data = await getSingleCurrency(currency, amount);
    
    const result = {
      code: currency,
      name: currency,
      rate: data.rate,
      amount: amount
    };
    
    // Cache'e kaydet
    cache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error(`${currency} kuru çekilirken hata:`, error);
    
    // 429 hatası için özel mesaj
    if (error.response && error.response.status === 429) {
      throw new Error('API istek limiti aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
    }
    
    throw error;
  }
}

/**
 * Cache'i temizle
 */
function clearCurrencyCache() {
  cache.clear();
}

module.exports = {
  getMainCurrencies,
  getCurrencyRate,
  clearCurrencyCache
};