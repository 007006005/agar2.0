const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

// Permetti connessioni esterne (utile se il game server è separato dal client)
app.use(cors());

// Aggiungi gli header corretti per i file JSON (incluso manifest.json)
app.use((req, res, next) => {
    if (req.url.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
    }
    next();
});

// Servi TUTTI i file statici dalla root o dalla cartella 'public' 
// Sostituisci __dirname con path.join(__dirname, 'public') se i tuoi file sono dentro /public
app.use(express.static(__dirname, {
    setHeaders: (res, path, stat) => {
        // Forza la cache per le immagini
        if (path.endsWith('.webp') || path.endsWith('.png') || path.endsWith('.svg')) {
            res.set('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

// Fallback: se nessuna route viene trovata, restituisci il file di gioco principale
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html')); // o 'public/game.html'
});

app.listen(PORT, () => {
    console.log(`🚀 ZeroAgar Server running on port ${PORT}`);
});
