/**
 * Gold-only filtering utilities
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
 * Filter only gold items (exclude silver)
 * @param {Array} goldData
 * @returns {Array}
 */
function filterGoldOnly(goldData) {
  return goldData.filter((item) => !isSilver(item));
}

module.exports = {
  filterGoldOnly,
  isSilver
};
