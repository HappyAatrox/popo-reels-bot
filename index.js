const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = "popo.gambler";

app.get('/latest-reel', async (req, res) => {
    try {
        const response = await axios.get(`https://imginn.com/${USERNAME}/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        let reelLink = null;

        // Szukamy bezpośredniego linku do reel'a
        $('a[href*="/reel/"]').first().each((i, el) => {
            let href = $(el).attr('href');
            if (href) {
                if (!href.startsWith('https')) {
                    reelLink = 'https://www.instagram.com' + (href.startsWith('/') ? href : '/' + href);
                } else {
                    reelLink = href;
                }
            }
        });

        if (reelLink) {
            res.send(`
🚨 **NAJNOWSZA ROLKA @${USERNAME}** 🚨

🔗 **Obejrzyj rolkę na Instagramie:**
${reelLink}

📍 Wszystkie rolki: https://www.instagram.com/${USERNAME}/reels
            `.trim());
        } else {
            res.send(`🔥 @popo.gambler\n\nNie znaleziono nowej rolki w tej chwili.\nSprawdź ręcznie: https://www.instagram.com/${USERNAME}/reels`);
        }

    } catch (error) {
        res.send(`❌ Nie udało się pobrać rolki. Spróbuj za chwilę.`);
    }
});

app.get('/', (req, res) => res.send('Serwer działa'));

app.listen(PORT, () => console.log('Serwer działa'));
