const { getCachedGoldData } = require('./gold_service');
const { filterSilverOnly } = require('../queries/silver_query');

/**
 * Get cached silver data by reusing gold cached payload
 * @returns {Promise<Array>}
 */
async function getCachedSilverData() {
  const all = await getCachedGoldData();
  return filterSilverOnly(all);
}

module.exports = {
  getCachedSilverData
};
