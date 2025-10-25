const { addSubscriber, removeSubscriber, getSubscribers } = require('../utils/scheduler');
const subscriptionService = require('../services/subscription_service');

function registerHandler(bot) {
  // Subscribe to daily updates
  bot.onText(/\/abone/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      const added = await addSubscriber(chatId);
      if (added) {
        bot.sendMessage(chatId, '✅ Günlük döviz bildirimlerine abone oldunuz! Her sabah saat 09:00\'da güncel kurları alacaksınız.');
      } else {
        bot.sendMessage(chatId, 'ℹ️ Zaten günlük döviz bildirimlerine abonesiniz.');
      }
    } catch (e) {
      console.error('Abone ekleme hatası:', e.message);
      bot.sendMessage(chatId, '❌ Abonelik işlemi sırasında sorun oluştu.');
    }
  });
  
  // Unsubscribe from daily updates
  bot.onText(/\/iptal/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      const removed = await removeSubscriber(chatId);
      if (removed) {
        bot.sendMessage(chatId, '✅ Günlük döviz bildirimlerinden ayrıldınız.');
      } else {
        bot.sendMessage(chatId, 'ℹ️ Günlük döviz bildirimlerine zaten abone değilsiniz.');
      }
    } catch (e) {
      console.error('Abonelik iptal hatası:', e.message);
      bot.sendMessage(chatId, '❌ Abonelik iptali sırasında sorun oluştu.');
    }
  });
  
  // Admin command to see subscriber count
  bot.onText(/\/aboneler/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      const subscribers = await getSubscribers();
      bot.sendMessage(chatId, `📊 Toplam abone sayısı: ${subscribers.length}`);
    } catch (e) {
      console.error('Abone sayısı hatası:', e.message);
      bot.sendMessage(chatId, '❌ Abone sayısı alınamadı.');
    }
  });
}

module.exports = { registerHandler };