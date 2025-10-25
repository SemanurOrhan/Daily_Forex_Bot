/**
 * Tüm formatlama işlemleri için merkezi formatter
 */

/**
 * Altın/Gümüş türüne göre emoji döndür
 * @param {string} name - Altın/Gümüş adı
 * @returns {string} Emoji
 */
function getGoldEmoji(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('gümüş')) {
    return '⚪';
  }
  
  return '🟡'; // Varsayılan altın emoji
}

/**
 * Para birimi koduna göre emoji döndür
 * @param {string} code - Para birimi kodu
 * @returns {string} Emoji
 */
function getCurrencyEmoji(code) {
  const emojiMap = {
    'USD': '💵',
    'EUR': '💶',
    'GBP': '💷',
    'JPY': '💴',
    'TRY': '💸',
    'RUB': '🪙',
    'CNY': '🪙',
    'CHF': '🪙',
    'CAD': '🪙',
    'AUD': '🪙'
  };
  
  return emojiMap[code] || '💰';
}

/**
 * Altın verilerini formatlar
 * @param {Array} goldData - Filtrelenmiş altın verileri
 * @returns {string} Formatlanmış mesaj
 */
function formatGoldData(goldData) {
  const lines = ["💰 *ALTIN FİYATLARI* 💰", ""];

  for (const item of goldData) {
    const emoji = getGoldEmoji(item.name);
    
    lines.push(
      `${emoji} *${item.name}*`,
      `   Alış: ${item.buyingstr} ₺`,
      `   Satış: ${item.sellingstr} ₺`,
      ""
    );
  }

  lines.push(`🕒 ${new Date().toLocaleString("tr-TR")}`);

  return lines.join("\n");
}

/**
 * TRY format helper
 * @param {number} n
 * @returns {string}
 */
function formatTRY(n) {
  try {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
  } catch (_) {
    if (typeof n === 'number' && !Number.isNaN(n)) return `${n.toFixed(2)} ₺`;
    return `${n} ₺`;
  }
}

/**
 * Extract and format price fields for gold/silver items
 * @param {Object} item
 */
function formatGoldSilverPrices(item) {
  let buyStr = null;
  let sellStr = null;

  if (typeof item.buying === 'number') buyStr = formatTRY(item.buying);
  if (typeof item.selling === 'number') sellStr = formatTRY(item.selling);

  if (!buyStr && typeof item.buyingstr === 'string') {
    buyStr = /₺|TL/i.test(item.buyingstr) ? item.buyingstr : `${item.buyingstr} ₺`;
  }
  if (!sellStr && typeof item.sellingstr === 'string') {
    sellStr = /₺|TL/i.test(item.sellingstr) ? item.sellingstr : `${item.sellingstr} ₺`;
  }

  // Bazı API kayıtlarında tek bir fiyat olabilir
  if (!buyStr && typeof item.price === 'number') buyStr = formatTRY(item.price);
  if (!sellStr && typeof item.price === 'number') sellStr = formatTRY(item.price);
  if (!buyStr && typeof item.pricestr === 'string') buyStr = /₺|TL/i.test(item.pricestr) ? item.pricestr : `${item.pricestr} ₺`;
  if (!sellStr && typeof item.pricestr === 'string') sellStr = /₺|TL/i.test(item.pricestr) ? item.pricestr : `${item.pricestr} ₺`;

  return { buyStr: buyStr || '-', sellStr: sellStr || '-' };
}

/**
 * Only GOLD list formatting (TRY)
 * @param {Array} items
 */
function formatGoldList(items) {
  const lines = ["🟡 *ALTIN FİYATLARI* 🟡", ""];

  for (const item of items) {
    const { buyStr, sellStr } = formatGoldSilverPrices(item);
    lines.push(
      `🟡 *${item.name}*`,
      `   Alış: ${buyStr}`,
      `   Satış: ${sellStr}`,
      ""
    );
  }

  lines.push(`🕒 ${new Date().toLocaleString('tr-TR')}`);
  return lines.join('\n');
}

/**
 * Only SILVER list formatting (TRY)
 * @param {Array} items
 */
function formatSilverList(items) {
  const title = items && items.length > 1 ? '⚪ *GÜMÜŞ FİYATLARI* ⚪' : '⚪ *GÜMÜŞ FİYATI* ⚪';
  const lines = [title, ""];

  for (const item of items) {
    const { buyStr, sellStr } = formatGoldSilverPrices(item);
    lines.push(
      `⚪ *${item.name}*`,
      `   Alış: ${buyStr}`,
      `   Satış: ${sellStr}`,
      ""
    );
  }

  lines.push(`🕒 ${new Date().toLocaleString('tr-TR')}`);
  return lines.join('\n');
}

/**
 * Para birimi verilerini formatlar
 * @param {Array} currencyData - Para birimi verileri
 * @returns {string} Formatlanmış mesaj
 */
function formatCurrencyData(currencyData) {
  const lines = ["💱 *DÖVİZ KURLARI* 💱", ""];
  
  for (const item of currencyData) {
    const emoji = getCurrencyEmoji(item.code);
    const rate = parseFloat(item.rate);
    
    if (isNaN(rate)) {
      console.warn(`Invalid rate for ${item.code}:`, item.rate);
      continue;
    }
    
    lines.push(
      `${emoji} *${item.name || item.code}*`,
      `   1 ${item.code} = ${rate.toFixed(4)} ₺`,
      ""
    );
  }
  
  lines.push(`🕒 ${new Date().toLocaleString("tr-TR")}`);

  return lines.join("\n");
}

/**
 * Tek bir para birimi kurunu formatlar
 * @param {string} currency - Para birimi kodu
 * @param {Object} data - Para birimi verisi
 * @returns {string} Formatlanmış mesaj
 */
function formatSingleCurrency(currency, data) {
  const emoji = getCurrencyEmoji(currency);
  const rate = parseFloat(data.rate);
  const lines = ["💱 *DÖVİZ KURU* 💱", ""];
  
  if (isNaN(rate)) {
    return formatErrorMessage(`${currency} için geçerli bir kur bulunamadı.`);
  }
  
  lines.push(
    `${emoji} *${data.name || currency}*`,
    `   1 ${currency} = ${rate.toFixed(4)} ₺`,
    ""
  );
  
  lines.push(`🕒 ${new Date().toLocaleString("tr-TR")}`);
  
  return lines.join("\n");
}

/**
 * Kripto para verilerini formatlar
 * @param {Array} cryptoData - Kripto para verileri
 * @returns {string} Formatlanmış mesaj
 */
function formatCryptoData(cryptoData) {
  const lines = ["₿ *KRİPTO PARA FİYATLARI* ₿", ""];
  
  if (!cryptoData || cryptoData.length === 0) {
    lines.push("❌ Kripto para verisi bulunamadı.", "");
  } else {
    for (const item of cryptoData) {
      // Rate'i kontrol et - farklı API'lerde farklı alan isimleri olabilir
      const rate = parseFloat(item.rate || item.price || item.pricestr || 0);
      const changeDay = parseFloat(item.changeDay || item.change || item.changestr || 0);
      
      if (isNaN(rate) || rate === 0) {
        console.warn(`Invalid rate for ${item.code}:`, item);
        continue;
      }
      
      const changeEmoji = changeDay > 0 ? '📈' : changeDay < 0 ? '📉' : '➡️';
      const changePart = !isNaN(changeDay) ? `   Değişim: ${changeEmoji} ${changeDay.toFixed(2)}%` : '';
      
      lines.push(
        `🪙 *${item.name || item.code} (${item.code})*`,
        `   Fiyat: $${rate.toFixed(2)}`,
        changePart,
        ""
      );
    }
  }
  
  lines.push(`🕒 ${new Date().toLocaleString("tr-TR")}`);
  
  return lines.join("\n");
}

/**
 * Tek bir kripto para verisini formatlar
 * @param {string} crypto - Kripto para kodu
 * @param {Object} data - Kripto para verisi
 * @returns {string} Formatlanmış mesaj
 */
function formatSingleCrypto(crypto, data) {
  const rate = parseFloat(data.rate || data.price || data.pricestr || 0);
  const changeDay = parseFloat(data.changeDay || data.change || data.changestr || 0);
  
  if (isNaN(rate) || rate === 0) {
    return formatErrorMessage(`${crypto} için geçerli bir fiyat bulunamadı.`);
  }
  
  const changeEmoji = changeDay > 0 ? '📈' : changeDay < 0 ? '📉' : '➡️';
  const lines = ["₿ *KRİPTO PARA FİYATI* ₿", ""];
  
  lines.push(
    `🪙 *${data.name || crypto} (${crypto})*`,
    `   Fiyat: $${rate.toFixed(2)}`
  );
  
  if (!isNaN(changeDay)) {
    lines.push(`   Değişim (24s): ${changeEmoji} ${changeDay.toFixed(2)}%`);
  }
  
  lines.push("", `🕒 ${new Date().toLocaleString("tr-TR")}`);
  
  return lines.join("\n");
}

/**
 * Hata mesajı formatlar
 * @param {string} message - Hata mesajı
 * @returns {string} Formatlanmış hata mesajı
 */
function formatErrorMessage(message) {
  return `⚠️ *HATA*\n\n${message}`;
}

/**
 * Bilgi mesajı formatlar
 * @param {string} message - Bilgi mesajı
 * @returns {string} Formatlanmış bilgi mesajı
 */
function formatInfoMessage(message) {
  return `ℹ️ ${message}`;
}

/**
 * Yükleniyor mesajı formatlar
 * @param {string} type - Veri tipi (örn: "Döviz kurları", "Altın fiyatları")
 * @returns {string} Formatlanmış yükleniyor mesajı
 */
function formatLoadingMessage(type) {
  return `⏳ ${type} getiriliyor...`;
}

module.exports = {
  getGoldEmoji,
  getCurrencyEmoji,
  formatGoldData,
  formatGoldList,
  formatSilverList,
  formatCurrencyData,
  formatSingleCurrency,
  formatCryptoData,
  formatSingleCrypto,
  formatErrorMessage,
  formatInfoMessage,
  formatLoadingMessage
};