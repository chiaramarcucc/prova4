const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const token = '8158288075:AAEUE8qkNuDCEMSrWgNFfXQ0s14Qs30WKjo'; // Sostituisci con il tuo token
const port = process.env.PORT || 3000;

const bot = new TelegramBot(token, { polling: true });

function saveHighScores(highScores) {
    fs.writeFileSync('highscores.json', JSON.stringify(highScores));
}

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/highscore') {
        bot.getGameHighScores(chatId, undefined, 'Prova1', (error, highScores) => {
            if (error) {
                console.error(error);
                bot.sendMessage(chatId, 'Errore durante il recupero della classifica.');
                return;
            }
            saveHighScores(highScores);
            bot.sendMessage(chatId, 'Classifica salvata su highscores.json!');
        });
    }
});

// ... (aggiungi qui il resto del codice del tuo bot)
