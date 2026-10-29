import { AUTO_BY_TOD, DEFAULT_SKIN, SKINS, SKIN_AUTO, isSkinId, lockedMode, skinById } from '../config/skins.js';
import { storageKey } from '../config/site.js';
import { prefersReducedMotion } from './env.js';
import { readBest, storageGet, storageSet } from './storage.js';
import { createEmitter } from './store.js';
import { timeOfDay } from './siteTime.js';
import { syncThemeColor, syncThemeNow } from './themeSync.js';

const KEY_CHOICE = storageKey('skin');
const KEY_EFFECTIVE = storageKey('skin-eff');
const KEY_UNLOCKED = storageKey('skins-unlocked');
const KEY_THEME = storageKey('theme');

const root = document.documentElement;
const emitter = createEmitter();
const toasts = new Set();

let choice = DEFAULT_SKIN;
let memTheme = null;
let previewing = null;
let swapTimer = 0;
let pointer = null;

const readUnlocked = () => new Set((storageGet(KEY_UNLOCKED) ?? '').split(',').filter(Boolean));
const meetsUnlock = (u) => readBest(storageKey(u.game)) >= u.min;

export const isUnlocked = (id) => {
  const u = skinById(id)?.unlock;
  return !u || meetsUnlock(u) || readUnlocked().has(id);
};
const isUsable = (id) => isSkinId(id) && isUnlocked(id);

export function onSkinToast(cb) {
  toasts.add(cb);
  return () => toasts.delete(cb);
}
export const skinToast = (toast) => toasts.forEach((cb) => cb(toast));

function announce(skins) {
  if (!skins.length) return;
  skinToast({
    text: `${skins.length > 1 ? 'skins' : 'skin'} unlocked: ${skins.map((s) => s.label).join(', ')}`,
    action: { label: 'try it', run: () => chooseSkin(skins[0].id) },
  });
}

export function checkSkinUnlocks() {
  const have = readUnlocked();
  const fresh = SKINS.filter((s) => s.unlock && !have.has(s.id) && meetsUnlock(s.unlock));
  if (!fresh.length) return;
  fresh.forEach((s) => have.add(s.id));
  storageSet(KEY_UNLOCKED, [...have].join(','));
  announce(fresh);
  emitter.emit();
}

export function unlockAllSkins() {
  const have = readUnlocked();
  const fresh = SKINS.filter((s) => s.unlock && !isUnlocked(s.id));
  SKINS.filter((s) => s.unlock).forEach((s) => have.add(s.id));
  storageSet(KEY_UNLOCKED, [...have].join(','));
  announce(fresh);
  emitter.emit();
}

const preferredTheme = () => ((memTheme ?? storageGet(KEY_THEME)) === 'light' ? 'light' : 'dark');
const themeFor = (skin) => lockedMode(skin) ?? preferredTheme();
const resolve = (c) => (c === SKIN_AUTO ? AUTO_BY_TOD[timeOfDay()] ?? DEFAULT_SKIN : c);

export const rememberTheme = (t) => {
  memTheme = t === 'light' ? 'light' : 'dark';
};
export const forcedTheme = () => lockedMode(root.dataset.skin);

const setAttrs = (skin, theme) => {
  root.dataset.skin = skin;
  root.dataset.theme = theme;
};

function swap(change) {
  window.clearTimeout(swapTimer);
  root.setAttribute('data-skin-swap', '');
  root.classList.add('theme-anim');
  change();
  syncThemeNow();
  syncThemeColor();
  emitter.emit();
  swapTimer = window.setTimeout(() => {
    root.classList.remove('theme-anim');
    root.removeAttribute('data-skin-swap');
  }, 160);
}

function transition(change, origin) {
  if (prefersReducedMotion() || typeof document.startViewTransition !== 'function') return swap(change);
  const { x, y } = origin ?? pointer ?? { x: innerWidth / 2, y: innerHeight / 2 };
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  let vt;
  try {
    vt = document.startViewTransition(() => swap(change));
  } catch {
    return swap(change);
  }
  vt.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    })
    .catch(() => {});
  vt.finished.catch(() => {});
}

export function chooseSkin(next, origin) {
  if (next !== SKIN_AUTO && !isUsable(next)) return false;
  const was = previewing;
  previewing = null;
  if (was) setAttrs(was.skin, was.theme);
  choice = next;
  storageSet(KEY_CHOICE, next);
  const skin = resolve(next);
  const theme = themeFor(skin);
  transition(() => {
    setAttrs(skin, theme);
    storageSet(KEY_EFFECTIVE, skin);
  }, origin);
  return true;
}

export function previewSkin(id) {
  const skin = id === SKIN_AUTO ? resolve(SKIN_AUTO) : id;
  if (!isUsable(skin) || (previewing === null && root.dataset.skin === skin)) return;
  previewing ??= { skin: root.dataset.skin, theme: root.dataset.theme };
  if (root.dataset.skin === skin) return;
  swap(() => setAttrs(skin, themeFor(skin)));
}
export function endPreview() {
  if (!previewing) return;
  const { skin, theme } = previewing;
  previewing = null;
  swap(() => setAttrs(skin, theme));
}

export function refreshAuto() {
  if (choice !== SKIN_AUTO || previewing) return;
  const skin = resolve(SKIN_AUTO);
  if (skin === root.dataset.skin) return;
  swap(() => {
    setAttrs(skin, themeFor(skin));
    storageSet(KEY_EFFECTIVE, skin);
  });
}

export const getChoice = () => choice;
export const getSkin = () => root.dataset.skin;

export const subscribeSkin = emitter.subscribe;
export const getSkinSnapshot = () => `${choice}|${root.dataset.skin}|${root.dataset.theme}|${storageGet(KEY_UNLOCKED) ?? ''}`;

(function init() {
  const saved = storageGet(KEY_CHOICE);
  choice = saved === SKIN_AUTO ? SKIN_AUTO : isUsable(saved) ? saved : DEFAULT_SKIN;
  const skin = resolve(choice);
  setAttrs(skin, themeFor(skin));
  storageSet(KEY_EFFECTIVE, skin);
  window.addEventListener(
    'pointerdown',
    (e) => {
      pointer = { x: e.clientX, y: e.clientY };
    },
    { capture: true, passive: true }
  );
})();
