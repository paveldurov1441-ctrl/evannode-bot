const http = require('http');
const mineflayer = require('mineflayer');

// ===== НАСТРОЙКИ СЕРВЕРА =====
const HOST = 'CreateFer.aternos.me';
const PORT = 47354;
const VERSION = '1.21.1';
const BOT_NAME = 'KeepAliveBot';
const BOTS_COUNT = 1;
// =============================

let online = 0;

function createBot(index) {
  const username = BOTS_COUNT > 1 ? `${BOT_NAME}_${index}` : BOT_NAME;

  console.log(`[${username}] Connecting to ${HOST}:${PORT} (${VERSION})...`);

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: username,
    version: VERSION,
    auth: 'offline',
    hideErrors: false
  });

  bot.on('login', () => {
    online++;
    console.log(`[${username}] LOGIN OK | online bots: ${online}`);
  });

  bot.on('spawn', () => {
    console.log(`[${username}] SPAWN — бот в игре`);
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);
      }
    }, 20000);
  });

  bot.on('kicked', (reason) => {
    console.log(`[${username}] KICKED:`, JSON.stringify(reason));
  });

  bot.on('error', (err) => {
    console.log(`[${username}] ERROR:`, err.message || err);
  });

  bot.on('end', (reason) => {
    online = Math.max(0, online - 1);
    console.log(`[${username}] DISCONNECTED: ${reason} | reconnect in 10s`);
    setTimeout(() => createBot(index), 10000);
  });
}

for (let i = 0; i < BOTS_COUNT; i++) {
  setTimeout(() => createBot(i + 1), i * 3000);
}

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(`Aternos KeepAlive\nBots online: ${online}\nServer: ${HOST}:${PORT}\nVersion: ${VERSION}\n`);
}).listen(process.env.PORT || 3000, () => {
  console.log('HTTP server started on port', process.env.PORT || 3000);
  console.log('Target:', HOST + ':' + PORT, VERSION);
});
