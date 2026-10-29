import { useEffect, useRef, useState } from 'react';
import { onReaction } from '../../../../lib/reactions.js';
import { pausableInterval } from '../../../../lib/timers.js';

const IDLE_MS = 35000;

export default function usePetLife(onReact) {
  const [asleep, setAsleep] = useState(false);
  const cb = useRef(onReact);
  const sleeping = useRef(false);
  useEffect(() => {
    cb.current = onReact;
  });
  useEffect(() => {
    let last = Date.now();
    const wake = () => {
      last = Date.now();
      if (sleeping.current) {
        sleeping.current = false;
        setAsleep(false);
        cb.current?.('wake');
      }
    };
    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll'];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    const stopIdle = pausableInterval(
      () => {
        if (!sleeping.current && Date.now() - last > IDLE_MS) {
          sleeping.current = true;
          setAsleep(true);
          cb.current?.('sleep');
        }
      },
      4000,
      { onResume: () => {} }
    );
    const off = onReaction((name, detail) => cb.current?.(name, detail));
    return () => {
      events.forEach((e) => window.removeEventListener(e, wake));
      stopIdle();
      off();
    };
  }, []);
  return asleep;
}
