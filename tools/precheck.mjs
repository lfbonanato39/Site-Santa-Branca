// Checagem pré-push (regra do CLAUDE.md): HTML válido + console limpo.
// Uso (na raiz do repositório):
//   cd tools && npm install      (só na primeira vez)
//   node tools/precheck.mjs      → precisa terminar com "RESULTADO: OK PARA PUSH"
// Sobe um servidor estático próprio na raiz do repositório (não precisa de Python),
// valida o HTML das 4 páginas e abre cada uma no Chrome instalado em 390 px (celular)
// e 1440 px, rolando até o fim. Falha com qualquer erro/aviso no console, erro de
// JavaScript, requisição que falhou ou resposta HTTP >= 400.
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '..');
const pages = ['index.html', 'privacidade.html', 'termos.html', '404.html'];
let failed = false;

// 1. HTML
try {
  execFileSync(process.execPath, [path.join(here, 'node_modules/html-validate/bin/html-validate.mjs'),
    '--preset', 'standard', ...pages], { cwd: site, stdio: 'pipe' });
  console.log(`HTML: ${pages.length} páginas válidas (0 erros)`);
} catch (e) {
  failed = true;
  console.log('HTML: ERROS\n' + (e.stdout?.toString() || e.message));
}

// 2. Servidor estático (só arquivos de dentro do repositório)
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm' };
const server = createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(site, '.' + rel);
  if (!file.startsWith(site + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('404'); return;
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': fs.statSync(file).size });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

// 3. Console
const browser = await chromium.launch({ channel: 'chrome' });
for (const vp of [{ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
                  { width: 1440, height: 900 }]) {
  const { isMobile, hasTouch, deviceScaleFactor, ...viewport } = vp;
  const ctx = await browser.newContext({ viewport, isMobile, hasTouch, deviceScaleFactor });
  for (const p of pages) {
    const page = await ctx.newPage();
    const msgs = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') msgs.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => msgs.push(`pageerror: ${e.message}`));
    page.on('requestfailed', r => { const f = r.failure()?.errorText || ''; if (!/ERR_ABORTED/.test(f)) msgs.push(`requestfailed: ${r.url()} (${f})`); });
    page.on('response', r => { if (r.status() >= 400) msgs.push(`http ${r.status()}: ${r.url()}`); });
    await page.goto(base + p, { waitUntil: 'load' });
    await page.evaluate(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await sleep(80); }
      await sleep(800);
    });
    const label = `${viewport.width}px ${p}`;
    if (msgs.length) { failed = true; console.log(`Console ${label}: ${msgs.length} problema(s)\n  ` + msgs.join('\n  ')); }
    else console.log(`Console ${label}: limpo`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
server.close();
console.log(failed ? 'RESULTADO: NÃO PODE FAZER PUSH' : 'RESULTADO: OK PARA PUSH');
process.exit(failed ? 1 : 0);
