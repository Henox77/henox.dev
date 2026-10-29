import { isNapping, onPauseChange } from './nap.js';
import { observeVisible } from './observe.js';

export function frameLoop(frame, { watch, onVisible, canRun = () => true, napGraceMs = 0, onResume, onPause } = {}) {
  let raf = 0;
  let visible = true;
  let dead = false;
  let grace = false;
  let graceTimer = 0;
  const should = () => visible && !document.hidden && (!isNapping() || grace) && canRun();
  const tick = (t) => {
    raf = requestAnimationFrame(tick);
    frame(t);
  };
  const sync = () => {
    if (dead) return;
    if (should()) {
      if (raf) return;
      onResume?.();
      raf = requestAnimationFrame(tick);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      onPause?.();
    }
  };
  let napped = isNapping();
  const onChange = () => {
    if (isNapping() !== napped) {
      napped = !napped;
      clearTimeout(graceTimer);
      grace = napGraceMs > 0 && napped;
      if (grace) {
        graceTimer = window.setTimeout(() => {
          grace = false;
          sync();
        }, napGraceMs);
      }
    }
    sync();
  };
  const offPause = onPauseChange(onChange);
  const offWatch = watch
    ? observeVisible(watch, (v) => {
        visible = v;
        onVisible?.(v);
        sync();
      })
    : null;
  sync();
  return {
    sync,
    stop() {
      dead = true;
      clearTimeout(graceTimer);
      cancelAnimationFrame(raf);
      raf = 0;
      offPause();
      offWatch?.();
    },
  };
}
