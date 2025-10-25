module.exports = {
  TOKEN: process.env.TELEGRAM_BOT_TOKEN || "REPLACE_ME",
  COLLECT_API_KEY: process.env.COLLECT_API_KEY || "apikey REPLACE_ME",
  TIMEZONE: process.env.TIMEZONE || "Europe/Istanbul",
  MONGODB_URI: process.env.MONGODB_URI || "",
  MONGODB_DB: process.env.MONGODB_DB || "",
};
