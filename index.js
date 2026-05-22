cat > index.js << 'EOF'
const http = require('http');
const mineflayer = require('mineflayer');

let online = 0;

function createBot() {
    const bot = mineflayer.createBot({
        host: 'Phantom_gold.aternos.me',
        port: 49761,
        username: 'eblan_' + Math.random().toString(36).slice(2, 7),
        version: '1.21.11',
        auth: 'offline'
    });

    bot.on('login', () => {
        online++;
        console.log('ONLINE: ' + online);
    });

    bot.on('spawn', () => {
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 300);
            }
        }, 20000);
    });

    bot.on('end', () => {
        online--;
        setTimeout(createBot, 10000);
    });

    bot.on('error', () => {});
}

for (let i = 0; i < 5; i++) {
    setTimeout(createBot, i * 3000);
}

http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bots online: ' + online);
}).listen(process.env.PORT || 3000);
EOF
