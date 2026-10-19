#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);

function findChrome() {
  return chromeCandidates.find((candidate) => fs.existsSync(candidate));
}

async function main() {
  const inputArg = process.argv[2] || path.join('resume', 'base.html');
  const htmlPath = path.resolve(inputArg);

  if (!fs.existsSync(htmlPath)) {
    console.error(`HTML file not found: ${htmlPath}`);
    process.exit(1);
  }

  const pdfPath = htmlPath.replace(/\.html?$/i, '.pdf');
  const executablePath = findChrome();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    ...(executablePath ? { executablePath } : {}),
  });

  try {
    const page = await browser.newPage();
    const html = await fs.promises.readFile(htmlPath, 'utf8');
    await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
    await page.emulateMediaType('print');
    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.6in',
        right: '0.65in',
        bottom: '0.6in',
        left: '0.65in',
      },
      displayHeaderFooter: false,
    });
    console.log(`PDF written: ${pdfPath}`);
    console.log(executablePath ? `Chrome: ${executablePath}` : 'Chrome: Puppeteer browser');
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
