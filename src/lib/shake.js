import { emitReaction } from './reactions.js';
import { hasFinePointer } from './env.js';

export function startShakeWatch() {
  if (!hasFinePointer()) return () => {};
  let lastX = null;
  let dir = 0;
  let swing = 0;
  let turns = [];
  let cool = 0;
  const onMove = (e) => {
    const x = e.clientX;
    if (lastX === null) {
      lastX = x;
      return;
    }
    const dx = x - lastX;
    lastX = x;
    if (!dx) return;
    const d = Math.sign(dx);
    if (d === dir) {
      swing += Math.abs(dx);
      return;
    }
    if (swing > 40) {
      const now = performance.now();
      turns = turns.filter((t) => now - t < 700);
      turns.push(now);
      if (turns.length >= 6 && now > cool) {
        cool = now + 6000;
        turns = [];
        emitReaction('shake');
      }
    }
    dir = d;
    swing = Math.abs(dx);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  return () => window.removeEventListener('pointermove', onMove);
}
