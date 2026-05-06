const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = "popo.gambler";

app.get('/latest-reel', async (req, res) => {
    res.send(`
🚨 **NAJNOWSZA ROLKA @${USERNAME}** 🚨

🔥 Sprawdź najnowsze rolki na profilu:

🔗 https://www.instagram.com/${USERNAME}/reels

📍 Profil: https://www.instagram.com/${USERNAME}
    `.trim());
});

app.get('/', (req, res) => res.send('Serwer działa - użyj /latest-reel'));

app.listen(PORT, () => {
    console.log(`✅ Serwer działa`);
});
