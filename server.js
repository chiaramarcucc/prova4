const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

let highScores = [];

try {
    const data = fs.readFileSync('highscores.json');
    highScores = JSON.parse(data);
} catch (err) {
    console.error('Errore durante la lettura del file highscores.json:', err);
}

function saveHighScores() {
    fs.writeFileSync('highscores.json', JSON.stringify(highScores));
}

const server = http.createServer((req, res) => {
    if (req.url === '/saveScore' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                highScores.push({ score: data.score, playerName: data.playerName });
                highScores.sort((a, b) => b.score - a.score);
                saveHighScores();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Punteggio salvato con successo!' }));
            } catch (err) {
                console.error('Errore durante l\'analisi del JSON:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dati non validi' }));
            }
        });
    } else {
        // Serve file statici
        const filePath = '.' + req.url;
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
});

server.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
