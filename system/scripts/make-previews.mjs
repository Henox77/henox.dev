
import { chromium } from 'playwright';
import { mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pagesOrigin } from '../../src/config/site.js';
import { slugOfFile } from '../../src/projects/slug.js';

const PROJECTS_DIR = new URL('../../src/projects/', import.meta.url);

async function loadProjects() {
  const entries = await readdir(fileURLToPath(PROJECTS_DIR), { withFileTypes: true });
  const list = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    try {
      const m = await import(new URL(`${e.name}/meta.js`, PROJECTS_DIR).href);
      list.push(m.default);
    } catch {
    }
  }
  return list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
const projects = await loadProjects();

const OUT = new URL('../../public/previews/', import.meta.url);
const VIEWPORT = { width: 1280, height: 720 };
const SETTLE_MS = 1500;
const filter = process.argv[2];

const siteOf = (p) => p.site || `${pagesOrigin}/${p.href.split('/').filter(Boolean).pop()}/`;

await mkdir(fileURLToPath(OUT), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT });
let ok = 0;

for (const p of projects) {
  if (filter && !p.file.includes(filter)) continue;
  if (p.manualShot) {
    console.log(`- ${p.file}  chụp tay (manualShot), bỏ qua`);
    continue;
  }
  const url = siteOf(p);
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
    if (!res || res.status() >= 400) {
      console.log(`✗ ${p.file}  ${url}  -> HTTP ${res ? res.status() : 'none'}, bỏ qua`);
      continue;
    }
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: fileURLToPath(new URL(`${slugOfFile(p.file)}.png`, OUT)), type: 'png' });
    console.log(`✓ ${p.file}  <- ${url}`);
    ok++;
  } catch (e) {
    console.log(`✗ ${p.file}  ${url}  -> ${e.message.split('\n')[0]}`);
  }
}

await browser.close();
console.log(`\nXong: ${ok} ảnh trong public/previews/`);
