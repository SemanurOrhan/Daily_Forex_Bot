const { MongoClient } = require('mongodb');
const config = require('../config');

let client;
let db;

async function connect() {
  if (db) return db;

  const uri = config.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in config');
  }

  client = new MongoClient(uri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 8000,
  });

  await client.connect();
  const dbName = config.MONGODB_DB || new URL(uri).pathname.replace('/', '') || 'dailyfxbot';
  db = client.db(dbName);

  // Ensure index for subscribers
  const col = db.collection('subscribers');
  await col.createIndex({ chatId: 1 }, { unique: true });

  return db;
}

function getDb() {
  if (!db) throw new Error('MongoDB not connected. Call connect() first.');
  return db;
}

async function getCollection(name) {
  if (!db) await connect();
  return db.collection(name);
}

async function disconnect() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}

module.exports = {
  connect,
  getDb,
  getCollection,
  disconnect,
};
