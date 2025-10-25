const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require("../config");

let client;
let db;

async function connect() {
  if (db) return db;

  if (!config.MONGODB_URI) {
    throw new Error("MONGODB_URI tanımlı değil");
  }

  client = new MongoClient(config.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    // TLS ile ilgili ek seçenek verme; URI yeterli.
  });

  await client.connect();

  // DB adı URI’de /DBNAME olarak verilmişse onu kullan, yoksa .env’deki MONGODB_DB
  const dbNameFromUri = (() => {
    try {
      const u = new URL(config.MONGODB_URI);
      return u.pathname && u.pathname !== "/" ? u.pathname.slice(1) : null;
    } catch {
      return null;
    }
  })();

  db = client.db(dbNameFromUri || config.MONGODB_DB);
  await db.command({ ping: 1 });

  // Unique index (aboneler)
  await db
    .collection("subscribers")
    .createIndex({ chatId: 1 }, { unique: true });

  return db;
}

async function getCollection(name) {
  const d = await connect();
  return d.collection(name);
}

async function disconnect() {
  if (client) await client.close();
  client = undefined;
  db = undefined;
}

module.exports = { connect, getCollection, disconnect };
