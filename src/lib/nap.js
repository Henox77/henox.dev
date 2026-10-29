import { useSyncExternalStore } from 'react';
import { createEmitter } from './store.js';
import { emitReaction } from './reactions.js';

let state = 'awake';
const { subscribe, emit } = createEmitter();

export const isNapping = () => state === 'nap';

export const isPaused = () => isNapping() || document.hidden;

const setSvgPaused = (paused) =>
  document.querySelectorAll('svg').forEach((svg) => (paused ? svg.pauseAnimations?.() : svg.unpauseAnimations?.()));

export const setNapState = (s) => {
  if (s === state) return;
  const wasNap = state === 'nap';
  state = s;
  document.documentElement.toggleAttribute('data-nap', s === 'nap');
  if ((s === 'nap') !== wasNap) {
    setSvgPaused(s === 'nap');
    emitReaction(s === 'nap' ? 'nap' : 'wake');
  }
  emit();
};

export const onNapChange = subscribe;

export function onPauseChange(cb) {
  const off = subscribe(cb);
  document.addEventListener('visibilitychange', cb);
  return () => {
    off();
    document.removeEventListener('visibilitychange', cb);
  };
}

export const useNap = () => useSyncExternalStore(subscribe, () => state);
