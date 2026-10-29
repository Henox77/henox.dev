import { useSyncExternalStore } from 'react';
import { getStatusKey } from './status.js';
import { emitReaction } from './reactions.js';
import { createEmitter } from './store.js';
import { site } from '../config/site.js';
import { pausableInterval } from './timers.js';
import { unlockAllSkins } from './skin.js';
import { getInitialLang, LANG_STORAGE_KEY } from './i18n.js';

const currentLang = () => {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) || getInitialLang();
  } catch {
    return 'en';
  }
};

const BASE = { online: 80, busy: 40, focus: 20, offline: 10 };

const REPLIES_EN = ['hi.', 'oh. hello again.', 'ok, that was a lot of talking', 'running low on words...'];
const REPLIES_TR = ['selam.', 'tekrar merhaba.', 'tamam, bu bayağı uzun bir sohbet oldu', 'kelimelerim tükeniyor...'];

const MAX_MS = 9000;

export const BATTERY_CELLS = 10;
export const toneOf = (level) => (level > 50 ? 'hi' : level > 20 ? 'mid' : 'lo');

let state = { drain: 0, months: 0, maxed: false, reply: '', hiAt: 0, maxAt: 0 };
let stopCharge = null;
let maxTimer = 0;

const set = (patch) => {
  state = { ...state, ...patch };
  emit();
};

export const getSocial = () => state;
export const levelOf = (s = state, key = getStatusKey()) => (s.maxed ? 100 : Math.max(0, BASE[key] - s.drain));
export const isAsleep = (s = state, key = getStatusKey()) => !s.maxed && BASE[key] - s.drain <= 0;

const chargeTick = () => state.drain > 0 && set({ drain: state.drain - 1 });

const catchUp = (ms) => {
  const slept = Math.floor(ms / 1000);
  if (slept > 0 && state.drain > 0) set({ drain: Math.max(0, state.drain - slept) });
};

const { subscribe, emit } = createEmitter({
  onFirst: () => (stopCharge = pausableInterval(chargeTick, 1000, { onResume: catchUp })),
  onLast: () => {
    stopCharge?.();
    stopCharge = null;
  },
});

export const onSocialChange = subscribe;
export const useSocial = () => useSyncExternalStore(subscribe, getSocial);
export const useLevel = () => useSyncExternalStore(subscribe, () => levelOf());
export const useAsleep = () => useSyncExternalStore(subscribe, () => isAsleep());

export function sayHi() {
  const isTr = currentLang() === 'tr';
  const replies = isTr ? REPLIES_TR : REPLIES_EN;

  if (state.maxed) {
    return set({
      reply: isTr ? 'SELAM!!! :D (bu pek normal değil)' : 'HI!!! :D (this is not normal)',
      hiAt: performance.now(),
    });
  }
  const key = getStatusKey();
  if (BASE[key] - state.drain <= 0) return;
  const next = state.drain + 20;
  const leftMsg = isTr
    ? `${site.id} sohbetten ayrıldı. (şarj oluyor...)`
    : `${site.id} has left the chat. (recharging...)`;
  set({
    drain: next,
    hiAt: performance.now(),
    reply: BASE[key] - next <= 0 ? leftMsg : replies[Math.min(Math.ceil(next / 20) - 1, replies.length - 1)],
  });
}

function unlock(msg) {
  const isTr = currentLang() === 'tr';
  clearTimeout(maxTimer);
  set({ maxed: true, months: 0, reply: msg, maxAt: performance.now() });
  maxTimer = setTimeout(
    () =>
      set({
        maxed: false,
        reply: isTr ? 'tamam. bugünlük bu kadar kişilik yeterli.' : 'ok. that is enough personality for today.',
      }),
    MAX_MS
  );
}

export const unlockKonami = () => {
  const isTr = currentLang() === 'tr';
  emitReaction('konami');
  unlock(
    isTr
      ? 'konami kabul edildi. kişilik %100. buna kim izin verdi?'
      : 'konami accepted. personality 100%. who let this happen?'
  );
  unlockAllSkins();
};

export function friendship() {
  const isTr = currentLang() === 'tr';
  if (state.maxed) return;
  if (state.months + 1 >= 6) {
    return unlock(
      isTr
        ? '6 tıklamada 6 aylık dostluk. speedrun kabul edildi.'
        : '6 months of friendship in 6 clicks. speedrun accepted.'
    );
  }
  set({
    months: state.months + 1,
    reply: isTr ? `ay ${state.months + 1}/6... devam et` : `month ${state.months + 1}/6... keep going`,
  });
}
