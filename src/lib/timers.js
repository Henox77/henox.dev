import { isPaused, onPauseChange } from './nap.js';

export function pausableInterval(fn, ms, { onResume = () => fn() } = {}) {
  let id = 0;
  let pausedAt = 0;
  let dead = false;
  const arm = () => {
    id = window.setTimeout(() => {
      id = 0;
      fn();
      if (!dead && !id && !isPaused()) arm();
    }, typeof ms === 'function' ? ms() : ms);
  };
  const sync = () => {
    if (dead) return;
    if (isPaused()) {
      if (!id) return;
      clearTimeout(id);
      id = 0;
      pausedAt = performance.now();
    } else if (!id) {
      const gap = pausedAt ? performance.now() - pausedAt : 0;
      pausedAt = 0;
      arm();
      if (gap) onResume(gap);
    }
  };
  const off = onPauseChange(sync);
  sync();
  return () => {
    dead = true;
    clearTimeout(id);
    id = 0;
    off();
  };
}
