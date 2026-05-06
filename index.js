const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = "popo.gambler";

app.get('/latest-reel', async (req, res) => {
    try {
        const urls = [
            `https://imginn.com/${USERNAME}/`,           // Najlepsza alternatywa 2026
            `https://dumpor.com/v/${USERNAME}`,
            `https://inflact.com/instagram-viewer/profile/${USERNAME}/`
        ];

        let html = '';
        let source = '';

        for (let url of urls) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 8000
                });
                html = response.data;
                source = url;
                break;
            } catch (e) {}
        }

        const $ = cheerio.load(html);
        let reelLink = null;
        let caption = "Nowa rolka od @popo.gambler 🔥";

        // Szukanie reelów
        $('a[href*="/reel/"], a[href*="/p/"]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('/reel/') || href.includes('/p/'))) {
                reelLink = 'https://www.instagram.com' + href;
                return false; // bierzemy pierwszy (najnowszy)
            }
        });

        if (reelLink) {
            res.send(`
🚨 **NAJNOWSZA ROLKA @${USERNAME}** 🚨

${caption}

🔗 Obejrzyj rolkę: ${reelLink}

📍 Wszystkie rolki → https://www.instagram.com/${USERNAME}/reels
            `.trim());
        } else {
            res.send(`🔥 @${USERNAME} — nie znaleziono nowych rolek w tej chwili.\nSpróbuj za chwilę!`);
        }

    } catch (error) {
        console.error(error);
        res.send(`❌ Błąd pobierania. Instagram mocno blokuje. Spróbuj za 5-10 minut.`);
    }
});

app.get('/', (req, res) => {
    res.send('Serwer działa - użyj /latest-reel');
});

app.listen(PORT, () => {
    console.log(`✅ Serwer działa na porcie ${PORT}`);
});
