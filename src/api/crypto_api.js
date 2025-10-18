const axios = require('axios');
const config = require('../config');

/**
 * Kripto para fiyatlarını getir
 * @returns {Promise<Array>} Kripto para verileri
 */
async function getCrypto() {
  try {
    console.log('Fetching crypto data...');
    
    const res = await axios.get(
      'https://api.collectapi.com/economy/cripto',
      {
        headers: { 
          authorization: config.COLLECT_API_KEY, 
          'content-type': 'application/json' 
        },
        timeout: 10000
      }
    );

    console.log('Crypto API Response:', JSON.stringify(res.data, null, 2));
    
    if (!res.data.success) {
      throw new Error('API returned unsuccessful response');
    }
    
    return res.data.result;
  } catch (error) {
    console.error('Crypto API Error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    throw error;
  }
}

module.exports = { getCrypto };