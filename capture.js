const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const artifactDir = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\24b6b32b-7b49-4cf4-bad6-25eebd860297';
  const localDir = path.join(__dirname, 'screenshots');

  if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
  
  const pages = [
    { url: 'http://localhost:3001', name: 'screenshot-home.png' },
    { url: 'http://localhost:3001/articles', name: 'screenshot-catalog.png' },
    { url: 'http://localhost:3001/dashboard', name: 'screenshot-dashboard.png' },
    { url: 'http://localhost:3001/articles/prod-1', name: 'screenshot-product-1.png' },
    { url: 'http://localhost:3001/articles/prod-2', name: 'screenshot-product-2.png' },
    { url: 'http://localhost:3001/articles/prod-3', name: 'screenshot-product-3.png' }
  ];

  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1080 });
    console.log(`Taking screenshot of ${p.url}...`);
    try {
      await page.goto(p.url, { waitUntil: 'load', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(artifactDir, p.name), fullPage: true });
      await page.screenshot({ path: path.join(localDir, p.name), fullPage: true });
      console.log(`✅ Saved ${p.name}`);
    } catch (err) {
      console.error(`❌ Failed ${p.url}:`, err.message);
      // Try one more time with less strict wait conditions
      try {
        console.log(`Retrying ${p.url} with relaxed conditions...`);
        await page.goto(p.url, { timeout: 15000 });
        await new Promise(r => setTimeout(r, 3000));
        await page.screenshot({ path: path.join(artifactDir, p.name), fullPage: true });
        await page.screenshot({ path: path.join(localDir, p.name), fullPage: true });
        console.log(`✅ Saved ${p.name} on retry`);
      } catch (retryErr) {
        console.error(`❌ Retry failed for ${p.url}`);
      }
    }
    await page.close();
  }

  console.log('Done!');
  await browser.close();
}

run().catch(console.error);
