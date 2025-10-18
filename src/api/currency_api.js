const axios = require('axios');
const config = require('../config');

/**
 * Tek bir para biriminin TRY karşılığını getir
 * @param {string} tag - Para birimi kodu (USD, EUR, vb.)
 * @param {number} amount - Miktar (varsayılan: 1)
 * @param {number} retries - Yeniden deneme sayısı
 * @returns {Promise<Object>} Para birimi verisi
 */
async function getSingleCurrency(tag, amount = 1, retries = 2) {
  try {
    console.log(`Fetching ${tag} currency with amount: ${amount}`);
    
    const res = await axios.get(
      `https://api.collectapi.com/economy/singleCurrency?int=${amount}&tag=${tag}`,
      {
        headers: { 
          authorization: config.COLLECT_API_KEY, 
          'content-type': 'application/json' 
        },
        timeout: 10000 // 10 saniye timeout
      }
    );

    console.log(`${tag} API Response:`, JSON.stringify(res.data, null, 2));
    
    if (!res.data.success) {
      throw new Error(`API returned unsuccessful response for ${tag}`);
    }
    
    return {
      code: tag,
      rate: parseFloat(res.data.result.text),
      amount: amount
    };
  } catch (error) {
    console.error(`Currency API Error for ${tag}:`, error.message);
    
    // 429 hatası için retry yapma
    if (error.response && error.response.status === 429) {
      console.error('Rate limit exceeded, not retrying');
      throw error;
    }
    
    // Diğer hatalar için retry
    if (retries > 0) {
      console.log(`Retrying ${tag}... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle
      return getSingleCurrency(tag, amount, retries - 1);
    }
    
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    throw error;
  }
}

module.exports = { getSingleCurrency };