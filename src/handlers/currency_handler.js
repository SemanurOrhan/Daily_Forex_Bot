const {
  getMainCurrencies,
  getCurrencyRate,
} = require("../services/currency_service");
const {
  formatCurrencyData,
  formatSingleCurrency,
  formatErrorMessage,
  formatLoadingMessage,
} = require("../utils/formatter");

/**
 * Döviz kuru handler'ını kaydet
 * @param {Object} bot - Telegram bot instance
 */
function registerHandler(bot) {
  // /kurlar komutu - Sadece USD ve EUR göster
  bot.onText(/\/kurlar$/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      bot.sendMessage(chatId, formatLoadingMessage("Döviz kurları"));

      const data = await getMainCurrencies();
      const message = formatCurrencyData(data);
      bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    } catch (err) {
      console.error("Kurlar hatası:", err.message);

      let errorMsg =
        "Kurları şu an çekemiyorum. Lütfen daha sonra tekrar deneyin.";

      if (
        err.message.includes("istek limiti") ||
        (err.response && err.response.status === 429)
      ) {
        errorMsg =
          "API istek limiti aşıldı. Lütfen 5-10 dakika sonra tekrar deneyin.";
      }

      bot.sendMessage(chatId, formatErrorMessage(errorMsg), {
        parse_mode: "Markdown",
      });
    }
  });

  // /kur <PARA_BİRİMİ> komutu - Özel para birimi sorgulama
  bot.onText(/\/kur\s+(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const currency = match[1].toUpperCase().trim();

    try {
      bot.sendMessage(chatId, formatLoadingMessage(`${currency} kuru`));

      const currencyData = await getCurrencyRate(currency, 1);
      const message = formatSingleCurrency(currency, currencyData);
      bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    } catch (err) {
      console.error(`${currency} kur hatası:`, err.message);

      let errorMsg = `${currency} kurunu şu an çekemiyorum veya geçerli bir para birimi değil.`;

      if (
        err.message.includes("istek limiti") ||
        (err.response && err.response.status === 429)
      ) {
        errorMsg =
          "API istek limiti aşıldı. Lütfen 5-10 dakika sonra tekrar deneyin.";
      }

      bot.sendMessage(chatId, formatErrorMessage(errorMsg), {
        parse_mode: "Markdown",
      });
    }
  });
}

module.exports = { registerHandler };
