import { useEffect, useState } from 'react';

const TOP = 80;
const DELTA = 8;

export default function useHideOnScroll(locked = false) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    let raf = 0;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const dy = y - last;
      if (locked || y < TOP) {
        setHidden(false);
        last = y;
      } else if (dy > DELTA) {
        setHidden(true);
        last = y;
      } else if (dy < -DELTA) {
        setHidden(false);
        last = y;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [locked]);

  return [hidden, () => setHidden(false)];
}
