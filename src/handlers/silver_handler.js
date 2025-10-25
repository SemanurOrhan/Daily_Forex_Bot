const { getCachedSilverData } = require('../services/silver_service');
const { 
  formatSilverList, 
  formatErrorMessage, 
  formatLoadingMessage 
} = require('../utils/formatter');

/**
 * Bot komutlarını kaydet (Gümüş)
 * @param {Object} bot - Telegram bot instance
 */
function registerHandler(bot) {
  // /gumus komutu - Sadece gümüş
  bot.onText(/\/gumus$/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      bot.sendMessage(chatId, formatLoadingMessage('Gümüş fiyatı'));
      const silver = await getCachedSilverData();

      if (!silver || silver.length === 0) {
        bot.sendMessage(chatId, formatErrorMessage('Gümüş verisi bulunamadı.'), { parse_mode: 'Markdown' });
        return;
      }

  const message = formatSilverList(silver);
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Gümüş hatası:', err);
      bot.sendMessage(chatId, formatErrorMessage('Gümüş fiyatını şu an çekemiyorum. Lütfen daha sonra tekrar deneyin.'), { parse_mode: 'Markdown' });
    }
  });
}

module.exports = { registerHandler };
