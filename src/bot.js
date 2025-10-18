const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const startHandler = require('./handlers/start_handler');
const currencyHandler = require('./handlers/currency_handler');
const goldHandler = require('./handlers/gold_and_silver_handler');
const cryptoHandler = require('./handlers/crypto_handler');
const subscriptionHandler = require('./handlers/subscription_handler');
const { scheduleDaily } = require('./utils/scheduler');

function initBot() {
  const bot = new TelegramBot(config.TOKEN, { polling: true });

  startHandler.registerHandler(bot);
  currencyHandler.registerHandler(bot);
  goldHandler.registerHandler(bot);
  cryptoHandler.registerHandler(bot);
  subscriptionHandler.registerHandler(bot);

  scheduleDaily(bot);
  return bot;
}

module.exports = { initBot };