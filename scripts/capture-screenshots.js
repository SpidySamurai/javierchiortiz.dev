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
];

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    for (const t of targets) {
      console.log('Capturing', t.url);
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 30000 });
  // small delay to allow animations
  await new Promise((res) => setTimeout(res, 800));
      const outPath = path.resolve(t.out);
      const outDir = path.dirname(outPath);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      await page.screenshot({ path: outPath, fullPage: true });
      console.log('Saved to', outPath);
    }

    await browser.close();
    console.log('Done');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
    process.exit(1);
  }
})();
