const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = "popo.gambler";

app.get('/latest-reel', async (req, res) => {
    try {
        // Kolejność viewerów - najlepsze działające w maj 2026
        const viewers = [
            `https://imginn.com/${USERNAME}/`,
            `https://dumpor.io/v/${USERNAME}`,     // zmienione na .io
            `https://greatfon.com/profile/${USERNAME}`,
            `https://inflact.com/instagram-viewer/profile/${USERNAME}/`
        ];

        let html = '';
        let successUrl = '';

        for (let url of viewers) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml'
                    },
                    timeout: 12000
                });
                html = response.data;
                successUrl = url;
                console.log(`✅ Użyto: ${url}`);
                break;
            } catch (err) {
                console.log(`❌ Nie działa: ${url}`);
            }
        }

        if (!html) {
            return res.send(`🔥 @popo.gambler\n\nNie udało się pobrać danych w tej chwili.\nSpróbuj za 10-15 minut.`);
        }

        const $ = cheerio.load(html);
        let reelLink = null;
        let caption = "Najnowsza rolka @popo.gambler 🔥";

        // Lepsze selektory
        $('a').each((i, el) => {
            const href = $(el).attr('href') || '';
            if (href.includes('/reel/') || href.includes('/p/')) {
                reelLink = 'https://www.instagram.com' + (href.startsWith('/') ? href : '/' + href);
                // Spróbuj wyciągnąć opis
                const text = $(el).text().trim() || $(el).attr('title') || $(el).closest('div').text().trim();
                if (text && text.length > 10) caption = text.slice(0, 160);
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
            res.send(`🔥 @popo.gambler\n\nZnaleziono profil, ale nie udało się wyciągnąć najnowszej rolki.\nSpróbuj za chwilę.`);
        }

    } catch (error) {
        res.send(`❌ Błąd serwera. Spróbuj za kilka minut.`);
    }
});

app.get('/', (req, res) => res.send('Serwer działa — użyj /latest-reel'));

app.listen(PORT, () => console.log(`✅ Serwer działa`));
