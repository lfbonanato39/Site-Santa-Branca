// Gera a imagem de compartilhamento a partir de tools/og-image.html (1200×630, JPEG).
// Uso (na raiz do repositório): node tools/render-og.mjs assets/og-image-v4.jpg
// Arquivo novo = nome novo (cache de 1 ano em /assets/). Depois trocar og:image,
// twitter:image e o "image" dos dados estruturados em index.html. Manter < 300 KB.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(process.cwd(), process.argv[2] || 'og-image-teste.jpg');
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, 'og-image.html')).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const fonts = await page.evaluate(() => [...document.fonts].map(f => `${f.family}: ${f.status}`).join(', '));
await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
await browser.close();
console.log(`${out} (${Math.round(fs.statSync(out).size / 1024)} KB) | fontes: ${fonts}`);
