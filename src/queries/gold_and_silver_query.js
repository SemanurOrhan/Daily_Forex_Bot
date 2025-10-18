const DEFAULT_GOLD_TYPES = ["Gram Altın", "Gümüş"];

/**
 * Altın ve gümüş verilerini filtreleme fonksiyonu
 * @param {Array} goldData - API'den gelen altın/gümüş verileri
 * @param {string|null} query - Filtrelemek için sorgu (opsiyonel)
 * @returns {Array} Filtrelenmiş veriler
 */
function filterGoldData(goldData, query = null) {
  // Query yoksa varsayılan türleri döndür
  if (!query || query.trim() === "") {
    const defaultTypes = new Set(DEFAULT_GOLD_TYPES);
    return goldData.filter((item) => defaultTypes.has(item.name));
  }

  // Query varsa isim bazlı filtrele
  const lowerQuery = query.toLowerCase();
  return goldData.filter((item) =>
    item.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Altın türlerinin listesini döndür
 * @returns {Array} Varsayılan altın türleri
 */
function getDefaultGoldTypes() {
  return [...DEFAULT_GOLD_TYPES];
}

module.exports = {
  filterGoldData,
  getDefaultGoldTypes
};