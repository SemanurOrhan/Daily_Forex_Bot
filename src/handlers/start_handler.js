function registerHandler(bot) {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const message = `
🤖 *TR Döviz Bot'a Hoş Geldiniz!*

Bu bot ile güncel döviz kurları, altın fiyatları ve kripto para değerlerini öğrenebilirsiniz.

📝 *Komutlar:*

/kurlar - Güncel döviz kurlarını gösterir
/altin - Altın ve Gümüş fiyatlarını gösterir
/kripto - Kripto para fiyatlarını gösterir
/kur USD - Belirli bir para biriminin değerini gösterir (örnek: /kur EUR)
/abone - Günlük döviz bildirimleri için abone olun
/iptal - Abonelikten çıkın

Veriler CollectAPI üzerinden alınmaktadır.
`;
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });

  // Help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Yardım için /start komutunu kullanabilirsiniz.');
  });
}

module.exports = { registerHandler };