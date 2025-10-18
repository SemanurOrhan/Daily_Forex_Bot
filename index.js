const path = require('path');
const fs = require('fs');
const { initBot } = require('./src/bot');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Data directory created');
}

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