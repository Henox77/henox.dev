import { getDpr } from './env.js';

export function fitCanvas(canvas, ctx, w, h, dpr = getDpr()) {
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return dpr;
}

const FALLBACK = {
  '--bg': '#0a0c10',
  '--panel': '#10141b',
  '--line': '#1d232c',
  '--text': '#dce1e8',
  '--text-dim': '#8a93a3',
  '--amber': '#ffc857',
  '--green': '#7ee081',
};

export const cssVar = (cs, name, fallback = FALLBACK[name]) => cs.getPropertyValue(name).trim() || fallback;
