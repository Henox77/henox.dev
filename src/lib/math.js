export const TAU = Math.PI * 2;

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

export const shuffled = (arr) => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const rand = (a, b) => a + Math.random() * (b - a);

export const smoothstep = (x) => x * x * (3 - 2 * x);

export const angDiff = (a, b) => {
  let d = a - b;
  d -= TAU * Math.floor(d / TAU + 0.5);
  return d;
};
