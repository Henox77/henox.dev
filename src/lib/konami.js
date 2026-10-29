import { useEffect, useRef } from 'react';
import { isTypingTarget } from './dom.js';

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

export function createKonamiMatcher(seq = KONAMI) {
  let keys = [];
  return (e) => {
    if (typeof e.key !== 'string' || isTypingTarget(e.target)) return false;
    keys = [...keys, e.key.toLowerCase()].slice(-seq.length);
    if (keys.length < seq.length || !keys.every((k, i) => k === seq[i])) return false;
    keys = [];
    return true;
  };
}

export function useKonami(onMatch) {
  const latest = useRef(onMatch);
  latest.current = onMatch;
  useEffect(() => {
    const match = createKonamiMatcher();
    const onKey = (e) => match(e) && latest.current();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
