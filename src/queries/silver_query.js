/**
 * Silver-only filtering utilities
 */

/**
 * Is item silver?
 * @param {Object} item
 * @returns {boolean}
 */
function isSilver(item) {
  const n = (item.name || '').toLowerCase();
  return n.includes('gümüş') || n.includes('gumus');
}

/**
 * Filter only silver items
 * @param {Array} goldData
 * @returns {Array}
 */
function filterSilverOnly(goldData) {
  return goldData.filter((item) => isSilver(item));
}

module.exports = {
  isSilver,
  filterSilverOnly
};
