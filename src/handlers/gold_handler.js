const { getCachedGoldData } = require('../services/gold_service');
const { filterGoldOnly } = require('../queries/gold_query');
const { 
  formatGoldList, 
  formatErrorMessage, 
  formatLoadingMessage 
} = require('../utils/formatter');

/**
 * Bot komutlarını kaydet (Altın)
 * @param {Object} bot - Telegram bot instance
 */
function registerHandler(bot) {
  // /altin komutu - Sadece altın türleri
  bot.onText(/\/altin(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match && match[1] ? match[1].trim() : null;

    try {
      bot.sendMessage(chatId, formatLoadingMessage('Altın fiyatları'));

      const all = await getCachedGoldData();
      let filtered = filterGoldOnly(all);

      if (query && query !== '') {
        const q = query.toLowerCase();
        filtered = filtered.filter((item) => (item.name || '').toLowerCase().includes(q));
      }

      if (filtered.length === 0) {
        bot.sendMessage(chatId, formatErrorMessage('Aradığınız altın türü bulunamadı.'), { parse_mode: 'Markdown' });
        return;
      }

  const message = formatGoldList(filtered);
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Altın hatası:', err);
      bot.sendMessage(chatId, formatErrorMessage('Altın fiyatlarını şu an çekemiyorum. Lütfen daha sonra tekrar deneyin.'), { parse_mode: 'Markdown' });
    }
  });
}

module.exports = { registerHandler };
