const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = "popo.gambler";

app.get('/latest-reel', async (req, res) => {
    try {
        const urls = [
            `https://imginn.com/${USERNAME}/`,
            `https://dumpor.com/v/${USERNAME}`,
            `https://inflact.com/instagram-viewer/profile/${USERNAME}/`
        ];

        let html = '';
        let usedSource = '';

        for (let url of urls) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 10000
                });
                html = response.data;
                usedSource = url;
                break;
            } catch (e) {}
        }

        const $ = cheerio.load(html);
        let reelLink = null;
        let caption = "Najnowsza rolka @popo.gambler";

        // Szukamy pierwszej (najnowszej) rolki
        $('a[href*="/reel/"], a[href*="/p/"]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('/reel/') || href.includes('/p/'))) {
                reelLink = 'https://www.instagram.com' + (href.startsWith('/') ? href : '/' + href);
                // Próba wyciągnięcia opisu
                const postText = $(el).closest('.post, .item').find('.description, .caption, .post-description').text().trim();
                if (postText) caption = postText.slice(0, 180) + (postText.length > 180 ? '...' : '');
                return false;
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
            res.send(`🔥 @popo.gambler\n\nNie udało się pobrać rolki w tej chwili. Spróbuj za chwilę.`);
        }

    } catch (error) {
        res.send(`❌ Błąd połączenia. Spróbuj za kilka minut.`);
    }
});

app.get('/', (req, res) => res.send('Serwer działa - użyj /latest-reel'));

app.listen(PORT, () => {
    console.log(`✅ Serwer działa`);
});
