import { useLayoutEffect } from 'react';

export default function useKeepOnScreen(ref, deps, margin = 8) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.translate = '0 0';
    const r = el.getBoundingClientRect();
    let dx = 0;
    if (r.right > window.innerWidth - margin) dx = window.innerWidth - margin - r.right;
    if (r.left + dx < margin) dx = margin - r.left;
    if (dx) el.style.translate = `${Math.round(dx)}px 0`;
  }, deps);
}
