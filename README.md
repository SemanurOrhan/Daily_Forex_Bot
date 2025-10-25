# 💹 DailyFXBot-TR (Turkish FX/Gold/Crypto Telegram Bot)

## What it does
- Live FX: USD and EUR to TRY
- Gold/Silver prices (separate commands): only gold with /altin, only silver with /gumus
- Popular cryptos: BTC, ETH, USDT, BNB, XRP, ADA, DOGE, SOL
- Daily 09:00 summary for subscribers

Data source: CollectAPI Economy endpoints.

## Commands (Telegram)
- /kurlar — Show USD and EUR to TRY rates
- /kurUSD — Show a single currency to TRY (e.g., /kur EUR)
- /altin — Only gold items (e.g., /altin Çeyrek to filter)
- /gumus — Only silver items
- /kripto — Popular cryptos list (BTC, ETH, etc.)
- /abone — Subscribe to daily summary (09:00 Europe/Istanbul)
- /iptal — Unsubscribe from the daily summary
- /aboneler — Show total subscriber count

## Requirements
- Node.js 18+
- Telegram Bot Token (BotFather)
- CollectAPI key (Economy) with the literal prefix: "apikey "
- MongoDB (Atlas or local) for subscriber storage

## Setup
1) Install dependencies:
```powershell
npm install
```

2) Create a .env file at the project root:
```
TELEGRAM_BOT_TOKEN=<your_bot_token>
COLLECT_API_KEY=apikey <your_collectapi_key>
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB=<db>
TIMEZONE=Europe/Istanbul
```
- Keep the "apikey " prefix for COLLECT_API_KEY
- If your password has special characters, URL‑encode it in the URI (@ → %40, etc.)

3) Start the bot:
```powershell
npm run dev
# or
npm start
```
You should see logs like:
```
🚀 Starting TR Doviz Bot...
📅 Daily update scheduled for 9:00 AM Europe/Istanbul
✅ Bot running successfully
Loaded N subscribers from MongoDB
```

## Subscription service (MongoDB)
- Subscribers are stored in MongoDB collection: subscribers
- Daily summary runs at 09:00 Europe/Istanbul via node-cron
- If a user blocks the bot (HTTP 403), they are removed from the list on send

## Folder structure (short)
```
src/
	bot.js                # Init bot + register handlers
	config.js             # Reads env for tokens/keys/timezone
	db/mongo.js           # MongoDB connection helper
	api/                  # CollectAPI clients
	handlers/             # Telegram command handlers
	services/             # Business logic + caching
	queries/              # Small filtering helpers
	utils/                # cache/formatter/scheduler
```

## Data sources (CollectAPI)
- Single currency: economy/singleCurrency?int=1&tag=USD
- Gold prices: economy/goldPrice
- Crypto: economy/cripto

## Troubleshooting
- "nodemon is not recognized": run `npm install` or use `npx nodemon index.js`, or `npm start`.
- MongoDB connect errors: check MONGODB_URI, network allowlist (Atlas Network Access), and URL‑encode special chars.
- API 429 rate limit: wait a few minutes; caching reduces calls but limits still apply.
- Gold/Silver separation: /altin shows only gold, /gumus shows only silver; that’s expected by design.

## License
MIT — see LICENSE.

