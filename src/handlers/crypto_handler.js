const { getCachedCryptoData, getPopularCryptos, findCrypto } = require('../services/crypto_service');
const { 
  formatCryptoData, 
  formatSingleCrypto, 
  formatErrorMessage, 
  formatLoadingMessage 
} = require('../utils/formatter');

/**
 * Kripto para handler'ını kaydet
 * @param {Object} bot - Telegram bot instance
 */
function registerHandler(bot) {
  // /kripto komutu - Popüler kripto paralar
  bot.onText(/\/kripto$/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      bot.sendMessage(chatId, formatLoadingMessage('Kripto para fiyatları'));
      
      const data = await getCachedCryptoData();
      console.log('Crypto data received:', JSON.stringify(data, null, 2));
      
      const popularCryptos = getPopularCryptos(data);
      console.log('Popular cryptos filtered:', popularCryptos.length, 'items');
      
      if (popularCryptos.length === 0) {
        bot.sendMessage(chatId, formatErrorMessage('Kripto para verileri bulunamadı.'), { parse_mode: 'Markdown' });
        return;
      }
      
      const message = formatCryptoData(popularCryptos);
      console.log('Formatted message:', message);
      
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Kripto hatası:', err.message);
      console.error('Full error:', err);
      
      let errorMsg = 'Kripto para fiyatlarını şu an çekemiyorum. Lütfen daha sonra tekrar deneyin.';
      
      if (err.message.includes('istek limiti') || (err.response && err.response.status === 429)) {
        errorMsg = 'API istek limiti aşıldı. Lütfen 5-10 dakika sonra tekrar deneyin.';
      }
      
      bot.sendMessage(chatId, formatErrorMessage(errorMsg), { parse_mode: 'Markdown' });
    }
  });

  // /kripto <COIN> komutu - Özel kripto para sorgulama
  bot.onText(/\/kripto\s+(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const crypto = match[1].toUpperCase().trim();
    
    try {
      bot.sendMessage(chatId, formatLoadingMessage(`${crypto} fiyatı`));
      
      const data = await getCachedCryptoData();
      const cryptoData = findCrypto(data, crypto);
      
      if (cryptoData) {
        const message = formatSingleCrypto(crypto, cryptoData);
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      } else {
        bot.sendMessage(chatId, formatErrorMessage(`${crypto} kripto parası bulunamadı.`), { parse_mode: 'Markdown' });
      }
    } catch (err) {
      console.error(`${crypto} hatası:`, err.message);
      
      let errorMsg = `${crypto} fiyatını şu an çekemiyorum.`;
      
      if (err.message.includes('istek limiti') || (err.response && err.response.status === 429)) {
        errorMsg = 'API istek limiti aşıldı. Lütfen 5-10 dakika sonra tekrar deneyin.';
      }
      
      bot.sendMessage(chatId, formatErrorMessage(errorMsg), { parse_mode: 'Markdown' });
    }
  });
}

module.exports = { registerHandler };