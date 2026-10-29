import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { site, base, siteUrl, githubUrl, repoUrl, title, storageKey } from '../src/config/site.js';
import { DEFAULT_SKIN, skinIdsToken, skinLocksToken } from '../src/config/skins.js';

const BANNER = `/*! ${site.handle} © ${site.year} ${site.name} (${siteUrl}) */\n`;
const copyrightBanner = () => ({
  name: 'copyright-banner',
  apply: 'build',
  generateBundle(_, bundle) {
    for (const file of Object.values(bundle)) {
      if (file.type === 'chunk') file.code = BANNER + file.code;
    }
  },
});

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500&family=Silkscreen:wght@400;700&family=VT323&family=Share+Tech+Mono&family=Special+Elite&family=Fira+Code:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap';
const TOKENS = {
  fontsUrl: FONTS_URL,
  name: site.name,
  handle: site.handle,
  year: site.year,
  repo: site.repo,
  title,
  description: site.description,
  siteUrl,
  githubUrl,
  repoUrl: repoUrl(),
  themeKey: storageKey('theme'),

  skinKey: storageKey('skin'),
  skinEffKey: storageKey('skin-eff'),
  defaultSkin: DEFAULT_SKIN,
  skinIds: skinIdsToken(),
  skinLocks: skinLocksToken(),
};
const escapeHtml = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const siteHtml = () => ({
  name: 'site-html',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        if (!(key in TOKENS)) throw new Error(`index.html: unknown token {{${key}}} (see TOKENS in system/vite.config.js)`);
        return escapeHtml(TOKENS[key]);
      }),
  },
});

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), siteHtml(), copyrightBanner()],
});
