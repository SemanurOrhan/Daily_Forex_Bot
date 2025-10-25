const { connect, getCollection } = require('../db/mongo');

async function init() {
  await connect();
}

async function addSubscriber(chatId) {
  await init();
  const col = await getCollection('subscribers');
  try {
    const res = await col.updateOne(
      { chatId },
      { $setOnInsert: { chatId, createdAt: new Date() } },
      { upsert: true }
    );
    return !!res.upsertedCount;
  } catch (err) {
    if (err && err.code === 11000) return false;
    throw err;
  }
}

async function removeSubscriber(chatId) {
  await init();
  const col = await getCollection('subscribers');
  const res = await col.deleteOne({ chatId });
  return res.deletedCount > 0;
}

async function getSubscribers() {
  await init();
  const col = await getCollection('subscribers');
  const docs = await col.find({}, { projection: { _id: 0, chatId: 1 } }).toArray();
  return docs.map(d => d.chatId);
}

async function countSubscribers() {
  await init();
  const col = await getCollection('subscribers');
  return col.countDocuments();
}

module.exports = {
  init,
  addSubscriber,
  removeSubscriber,
  getSubscribers,
  countSubscribers,
};