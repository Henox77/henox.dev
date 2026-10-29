import { isNapping, onNapChange } from './nap.js';

const SETTLE_MS = 150;
export const syncThemeColor = () => {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
};

const listeners = new Set();
let until = 0;
let raf = 0;
let mo = null;
let owed = false;

const loop = () => {
  raf = 0;
  if (isNapping()) {
    owed = true;
    return;
  }
  listeners.forEach((cb) => cb());
  raf = performance.now() < until ? requestAnimationFrame(loop) : 0;
};
export function syncThemeNow() {
  if (isNapping()) {
    owed = true;
    return;
  }
  listeners.forEach((cb) => cb());
}
const kick = () => {
  if (isNapping()) {
    owed = true;
    return;
  }
  until = performance.now() + SETTLE_MS;
  if (!raf) raf = requestAnimationFrame(loop);
};
onNapChange(() => {
  if (owed && !isNapping() && listeners.size) {
    owed = false;
    kick();
  }
});

export function onThemeChange(cb) {
  listeners.add(cb);
  if (!mo) {
    mo = new MutationObserver(kick);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-tod', 'data-skin'] });
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size && mo) {
      mo.disconnect();
      mo = null;
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
