const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const targets = [
  {
    url: 'https://spidysamurai.github.io/SPA_rick_and_morty/',
    out: 'public/utils/img/spa-rick-and-morty-screenshot.png',
  },
  {
    url: 'https://spidysamurai.github.io/Batata-bit/',
    out: 'public/utils/img/batata-bit-screenshot.png',
  },
  {
    url: 'https://spidysamurai.github.io/Kittys_api_consuming/',
    out: 'public/utils/img/kittys-api-consuming-screenshot.png',
  },
  // personal site (added so this script can capture it too)
  {
    url: 'https://javierchiortiz.dev/',
    out: 'public/utils/img/portfolio-personal-live-screenshot.png',
  },
  {
    url: 'https://scandiamfg.com/',
    out: 'public/utils/img/scandia-manufacturing-screenshot.png',
  },
  {
    url: 'https://saunas.com/',
    out: 'public/utils/img/saunas-screenshot.png',
  },
  {
    url: 'https://sunvalleysalt.com/',
    out: 'public/utils/img/sunvalleysalt-screenshot.png',
  },
  {
    url: 'https://lab2next.com/',
    out: 'public/utils/img/lab2next-screenshot.png',
  },
  {
    url: 'https://app.lab2next.com/',
    out: 'public/utils/img/lab2next-app-screenshot.png',
  },
];

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const force = process.argv.includes('--force');

    for (const t of targets) {
      try {
        console.log('Processing', t.url);
        const outPath = path.resolve(t.out);
        if (fs.existsSync(outPath) && !force) {
          console.log(' -> Skipping, file exists:', outPath);
          continue;
        }

        await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 30000 });
        // small delay to allow animations
        await new Promise((res) => setTimeout(res, 800));

        const outDir = path.dirname(outPath);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        await page.screenshot({ path: outPath, fullPage: true });
        console.log('Saved to', outPath);
      } catch (err) {
        console.error(' - Failed to capture', t.url, err && err.message ? err.message : err);
      }
    }

    await browser.close();
    console.log('Done');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
    process.exit(1);
  }
})();
