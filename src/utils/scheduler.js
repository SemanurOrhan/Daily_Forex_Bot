const cron = require('node-cron');
const config = require('../config');
const { getSingleCurrency } = require('../api/currency_api');
const subscriptionService = require('../services/subscription_service');

async function initSubscribers() {
  try {
    await subscriptionService.init();
    const count = await subscriptionService.countSubscribers();
    console.log(`Loaded ${count} subscribers from MongoDB`);
  } catch (err) {
    console.error('Failed to initialize subscribers (MongoDB):', err.message);
  }
}

function scheduleDaily(bot) {
  initSubscribers();
  
  cron.schedule(
    '0 9 * * *',
    async () => {
      try {
        console.log('Running daily currency update task');
        const usd = await getSingleCurrency('USD', 1);
        const eur = await getSingleCurrency('EUR', 1);

        const formatTL = (n) => {
          const num = Number(n);
          if (Number.isNaN(num)) return '-';
          return num.toFixed(2);
        };

        const message = `
📅 *Günlük Döviz Özeti*
🇺🇸 Dolar: ${formatTL(usd.rate)}₺  
🇪🇺 Euro: ${formatTL(eur.rate)}₺  
`;

        const subscribers = await subscriptionService.getSubscribers();
        const sendPromises = subscribers.map(id => {
          return bot.sendMessage(id, message, { parse_mode: 'Markdown' })
            .catch(err => {
              console.error(`Failed to send daily update to ${id}:`, err.message);
              if (err.response && err.response.statusCode === 403) {
                return subscriptionService.removeSubscriber(id);
              }
            });
        });
        
        await Promise.all(sendPromises);
        console.log(`✅ Günlük mesaj ${subscribers.length} aboneye gönderildi`);
      } catch (err) {
        console.error('Günlük görev hatası:', err.message);
      }
    },
    { timezone: config.TIMEZONE }
  );
  
  console.log(`📅 Daily update scheduled for 9:00 AM ${config.TIMEZONE}`);
}

module.exports = {
  scheduleDaily,
  addSubscriber: subscriptionService.addSubscriber,
  removeSubscriber: subscriptionService.removeSubscriber,
  getSubscribers: subscriptionService.getSubscribers
};