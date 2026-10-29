
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const MQ_MD = '(min-width: 48rem)';

export const canHover = () => window.matchMedia('(hover: hover)').matches;

export const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches;

export const touchText = (text, coarse = isCoarsePointer()) =>
  coarse
    ? String(text)
        .replace(/move (your|the) cursor/gi, 'drag your finger')
        .replace(/\bcursor\b/gi, 'finger')
        .replace(/\bclick(ed|ing)?\b/gi, (_, s) => (s ? `tap${s === 'ed' ? 'ped' : 'ping'}` : 'tap'))
    : text;

export const getDpr = () => Math.min(window.devicePixelRatio || 1, 2);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const motionSleep = (ms) => sleep(prefersReducedMotion() ? 0 : ms);

export const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
