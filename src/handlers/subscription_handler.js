const { addSubscriber, removeSubscriber, getSubscribers } = require('../utils/scheduler');

function registerHandler(bot) {
  // Subscribe to daily updates
  bot.onText(/\/abone/, (msg) => {
    const chatId = msg.chat.id;
    
    if (addSubscriber(chatId)) {
      bot.sendMessage(chatId, '✅ Günlük döviz bildirimlerine abone oldunuz! Her sabah saat 09:00\'da güncel kurları alacaksınız.');
    } else {
      bot.sendMessage(chatId, 'ℹ️ Zaten günlük döviz bildirimlerine abonesiniz.');
    }
  });
  
  // Unsubscribe from daily updates
  bot.onText(/\/iptal/, (msg) => {
    const chatId = msg.chat.id;
    
    if (removeSubscriber(chatId)) {
      bot.sendMessage(chatId, '✅ Günlük döviz bildirimlerinden ayrıldınız.');
    } else {
      bot.sendMessage(chatId, 'ℹ️ Günlük döviz bildirimlerine zaten abone değilsiniz.');
    }
  });
  
  // Admin command to see subscriber count
  bot.onText(/\/aboneler/, (msg) => {
    const chatId = msg.chat.id;
    const subscribers = getSubscribers();
    
    bot.sendMessage(chatId, `📊 Toplam abone sayısı: ${subscribers.length}`);
  });
}

module.exports = { registerHandler };