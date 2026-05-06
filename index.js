const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = "popo.gambler";

app.get('/latest-reel', async (req, res) => {
    try {
        // Używamy Dumpor (lepsza alternatywa dla Picuki w 2026)
        const { data } = await axios.get(`https://dumpor.com/v/${USERNAME}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(data);
        let reelLink = null;
        let caption = "Nowa rolka!";

        // Szukamy najnowszego reel'a
        $('a[href*="/reel/"]').first().each((i, el) => {
            reelLink = 'https://www.instagram.com' + $(el).attr('href');
        });

        if (reelLink) {
            res.send(`
🚨 **NAJNOWSZA ROLKA @${USERNAME}** 🚨

${caption}

🔗 Obejrzyj rolkę: ${reelLink}

📍 Wszystkie rolki: https://www.instagram.com/${USERNAME}/reels
            `.trim());
        } else {
            res.send(`🔥 @${USERNAME} — nie znaleziono nowych rolek w tej chwili.`);
        }

    } catch (error) {
        res.send(`❌ Nie udało się pobrać najnowszej rolki. Spróbuj później.`);
    }
});

app.listen(PORT, () => console.log(`Serwer działa`));
