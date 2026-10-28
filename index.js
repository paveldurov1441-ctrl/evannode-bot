const http = require('http');
const mineflayer = require('mineflayer');

// ===== НАСТРОЙКИ СЕРВЕРА =====
const HOST = 'CreateFer.aternos.me';
const PORT = 47354;
const VERSION = '1.21.1';
const BOT_NAME = 'KeepAliveBot'; // ник бота (offline)
const BOTS_COUNT = 1;           // сколько ботов (1 достаточно для Aternos)
// =============================

let online = 0;

function createBot(index) {
  const username = BOTS_COUNT > 1 ? `${BOT_NAME}_${index}` : BOT_NAME;

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
    // Анти-АФК: прыжок каждые 20 сек
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);
      }
    }, 20000);
  });

  bot.on('kicked', (reason) => {
    console.log(`[${username}] KICKED:`, reason);
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

// Запуск ботов
for (let i = 0; i < BOTS_COUNT; i++) {
  setTimeout(() => createBot(i + 1), i * 3000);
}

// HTTP для Evennode (чтобы процесс не уснул)
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(`Aternos KeepAlive\nBots online: ${online}\nServer: ${HOST}:${PORT}\n`);
}).listen(process.env.PORT || 3000, () => {
  console.log('HTTP server started');
});
