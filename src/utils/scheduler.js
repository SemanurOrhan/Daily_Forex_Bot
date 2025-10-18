const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const { getCurrency } = require('../api/currency_api');
const { formatCurrency } = require('./formatter');

// Store subscribers in a file to persist across restarts
const SUBSCRIBERS_FILE = path.join(__dirname, '../../data/subscribers.json');

// In-memory subscribers list
let subscribers = [];

// Initialize subscribers from file
async function initSubscribers() {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(SUBSCRIBERS_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Try to load existing subscribers
    try {
      const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf8');
      subscribers = JSON.parse(data);
      console.log(`Loaded ${subscribers.length} subscribers from file`);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Error loading subscribers:', err.message);
      } else {
        console.log('No subscribers file found, starting with empty list');
        // Create empty file
        await saveSubscribers();
      }
    }
  } catch (err) {
    console.error('Failed to initialize subscribers:', err.message);
  }
}

// Save subscribers to file
async function saveSubscribers() {
  try {
    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
  } catch (err) {
    console.error('Failed to save subscribers:', err.message);
  }
}

function scheduleDaily(bot) {
  // Initialize subscribers
  initSubscribers();
  
  // Schedule daily updates
  cron.schedule(
    '0 9 * * *',
    async () => {
      try {
        console.log('Running daily currency update task');
        const data = await getCurrency('USD');
        const usdTry = data.find((c) => c.code === 'TRY');
        const eur = data.find((c) => c.code === 'EUR');
        
        if (!usdTry || !eur) {
          throw new Error('Required currency data not found in API response');
        }
        
        const message = `
📅 *Günlük Döviz Özeti*
🇺🇸 Dolar: ${formatCurrency(usdTry.rate)}₺  
🇪🇺 Euro: ${formatCurrency(usdTry.rate / eur.rate)}₺  
`;

        // Send to all subscribers
        const sendPromises = subscribers.map(id => {
          return bot.sendMessage(id, message, { parse_mode: 'Markdown' })
            .catch(err => {
              console.error(`Failed to send daily update to ${id}:`, err.message);
              // If user blocked the bot, remove from subscribers
              if (err.response && err.response.statusCode === 403) {
                return removeSubscriber(id);
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

function addSubscriber(chatId) {
  if (!subscribers.includes(chatId)) {
    subscribers.push(chatId);
    saveSubscribers();
    return true;
  }
  return false;
}

function removeSubscriber(chatId) {
  const initialLength = subscribers.length;
  subscribers = subscribers.filter((id) => id !== chatId);
  if (subscribers.length !== initialLength) {
    saveSubscribers();
    return true;
  }
  return false;
}

module.exports = {
  scheduleDaily,
  addSubscriber,
  removeSubscriber,
  getSubscribers: () => subscribers
};