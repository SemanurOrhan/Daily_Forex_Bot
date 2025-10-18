const { getCachedGoldData } = require('../services/gold_service');
const { filterGoldData } = require('../queries/gold_and_silver_query');
const { 
  formatGoldData, 
  formatErrorMessage, 
  formatLoadingMessage 
} = require('../utils/formatter');

/**
 * Altın verilerini işle ve gönder
 * @param {Object} ctx - Telegram context
 * @param {string|null} query - Filtreleme sorgusu
 */
async function handleGoldRequest(ctx, query = null) {
  try {
    const goldData = await getCachedGoldData();
    const filteredData = filterGoldData(goldData, query);
    
    if (filteredData.length === 0) {
      return ctx.reply(formatErrorMessage('Aradığınız altın/gümüş türü bulunamadı.'), { parse_mode: 'Markdown' });
    }
    
    const formattedResponse = formatGoldData(filteredData);
    return ctx.reply(formattedResponse, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error("Altın/Gümüş verisi çekilirken hata:", error);
    return ctx.reply(formatErrorMessage('Altın/Gümüş verilerini alırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'), { parse_mode: 'Markdown' });
  }
}

/**
 * Bot komutlarını kaydet
 * @param {Object} bot - Telegram bot instance
 */
function registerHandler(bot) {
  // /altin komutu - Gram Altın ve Gümüş göster
  bot.onText(/\/altin(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1] ? match[1].trim() : null;
    
    bot.sendMessage(chatId, formatLoadingMessage('Altın fiyatları'));
    
    await handleGoldRequest({ 
      reply: (text, options) => bot.sendMessage(chatId, text, options) 
    }, query);
  });
  
  // /gumus komutu - Sadece gümüş
  bot.onText(/\/gumus/, async (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, formatLoadingMessage('Gümüş fiyatı'));
    
    await handleGoldRequest({ 
      reply: (text, options) => bot.sendMessage(chatId, text, options) 
    }, "Gümüş");
  });
}

module.exports = { registerHandler };