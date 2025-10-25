require('dotenv').config();
const { initBot } = require('./src/bot');
 

// Handle unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the bot
console.log('🚀 Starting TR Doviz Bot...');
const bot = initBot();
console.log('✅ Bot running successfully');

// Export the bot instance
module.exports = { bot };