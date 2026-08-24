// Server minimo SOLO per vedere il sito in anteprima sul proprio computer
// prima di pubblicarlo. Una volta online (Netlify), questo file non serve piu':
// il sito e' completamente statico e il pannello foto (/admin) funziona
// tramite Decap CMS + GitHub, senza bisogno di alcun server.
//
// Uso: npm install && npm start
// Poi apri http://localhost:3000

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

app.listen(PORT, () => {
  console.log(`Anteprima disponibile su http://localhost:${PORT}`);
  console.log('Nota: /admin qui in locale non fara\' login (serve GitHub + hosting online).');
});
