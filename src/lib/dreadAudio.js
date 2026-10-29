export const PARAM_STEP = 0.05;

export function noiseBuffer(c, seconds = 2) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

export function makeDread() {
  let ctx = null;
  let n = null;
  let failed = false;
  let touched = performance.now();
  let breathPhase = 0;
  let beatPhase = 0;
  let hushUntil = 0;
  let watchdog = 0;
  let ducked = true;
  let paramAt = 0;

  const api = {
    get on() {
      return !!n;
    },
    get ctx() {
      return ctx;
    },
    get out() {
      return n?.out ?? null;
    },
    get hit() {
      return n?.hit ?? null;
    },
    start() {
      if (n || failed) {
        ctx?.resume?.();
        return;
      }
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) throw new Error('no audio');
        ctx = new Ctx();
        const master = ctx.createGain();
        master.gain.value = 0;
        const comp = ctx.createDynamicsCompressor();
        master.connect(comp);
        comp.connect(ctx.destination);
        const out = ctx.createGain();
        out.gain.value = 1;
        out.connect(master);

        const droneG = ctx.createGain();
        droneG.gain.value = 0;
        for (const f of [38, 40.5]) {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = f;
          o.connect(droneG);
          o.start();
        }
        const saw = ctx.createOscillator();
        saw.type = 'sawtooth';
        saw.frequency.value = 55;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 130;
        const sawG = ctx.createGain();
        sawG.gain.value = 0.25;
        saw.connect(lp);
        lp.connect(sawG);
        sawG.connect(droneG);
        saw.start();
        droneG.connect(out);

        const bsrc = ctx.createBufferSource();
        bsrc.buffer = noiseBuffer(ctx);
        bsrc.loop = true;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 520;
        bp.Q.value = 0.7;
        const breathG = ctx.createGain();
        breathG.gain.value = 0;
        bsrc.connect(bp);
        bp.connect(breathG);
        breathG.connect(out);
        bsrc.start();

        const whineG = ctx.createGain();
        whineG.gain.value = 0;
        for (const f of [2950, 3013]) {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = f;
          o.connect(whineG);
          o.start();
        }
        whineG.connect(out);

        const hit = ctx.createGain();
        const limiter = ctx.createDynamicsCompressor();
        limiter.threshold.value = -8;
        limiter.knee.value = 4;
        limiter.ratio.value = 20;
        limiter.attack.value = 0.002;
        limiter.release.value = 0.3;
        hit.connect(limiter);
        limiter.connect(ctx.destination);
        const curve = new Float32Array(1024);
        for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh((i / 512 - 1) * 6);
        const dist = ctx.createWaveShaper();
        dist.curve = curve;
        dist.oversample = '2x';
        dist.connect(hit);

        n = { master, out, hit, dist, droneG, breathG, whineG, noiseBuf: noiseBuffer(ctx, 1) };
        ctx.resume?.();
        watchdog = setInterval(() => {
          if (n && !ducked && performance.now() - touched > 350) {
            ducked = true;
            n.master.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
          }
        }, 150);
      } catch {
        failed = true;
        n = null;
        ctx?.close?.().catch(() => {});
        ctx = null;
      }
    },
    update(p, dt) {
      if (!n) return;
      touched = performance.now();
      const t = ctx.currentTime;
      if (ducked) {
        ducked = false;
        n.master.gain.setTargetAtTime(0.55, t, 0.05);
      }
      const k = t < hushUntil ? 0 : 1;
      breathPhase += dt * (1.1 + (p.breath ?? 0) * 1.8) * Math.PI * 2 * 0.5;
      if (t - paramAt >= PARAM_STEP) {
        paramAt = t;
        n.droneG.gain.setTargetAtTime((p.drone ?? 0) * 0.3 * k, t, 0.15);
        const br = (p.breath ?? 0) * 0.55 * (0.5 + 0.5 * Math.sin(breathPhase)) * k;
        n.breathG.gain.setTargetAtTime(br, t, 0.08);
        n.whineG.gain.setTargetAtTime((p.whine ?? 0) * 0.012 * k, t, 0.2);
      }
      if (k && (p.beat ?? 0) > 0.02) {
        beatPhase += dt * (0.9 + p.beat * 1.7);
        if (beatPhase >= 1) {
          beatPhase -= 1;
          api.thump(0.35 + 0.55 * p.beat);
          api.thump(0.2 + 0.3 * p.beat, 0.2);
        }
      }
    },
    thump(power = 0.6, delay = 0) {
      if (!n) return;
      const t = ctx.currentTime + delay;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(75, t);
      o.frequency.exponentialRampToValueAtTime(32, t + 0.16);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.9 * power, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      o.connect(g);
      g.connect(n.out);
      o.start(t);
      o.stop(t + 0.3);
    },
    hush(seconds = 1) {
      if (!n) return;
      const t = ctx.currentTime;
      hushUntil = t + seconds;
      for (const g of [n.droneG, n.breathG, n.whineG]) {
        g.gain.cancelScheduledValues(t);
        g.gain.setTargetAtTime(0, t, 0.015);
      }
    },
    jump(power = 1) {
      if (!n) return;
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = n.noiseBuf;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0, t);
      ng.gain.linearRampToValueAtTime(0.9 * power, t + 0.004);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
      src.connect(ng);
      ng.connect(n.dist);
      src.start(t);
      src.stop(t + 1);
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0, t);
      sg.gain.linearRampToValueAtTime(0.8 * power, t + 0.02);
      sg.gain.linearRampToValueAtTime(0.6 * power, t + 0.7);
      sg.gain.exponentialRampToValueAtTime(0.001, t + 1.7);
      for (const [freq, q] of [[950, 3], [2400, 5]]) {
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = freq;
        bp.Q.value = q;
        sg.connect(bp);
        bp.connect(n.dist);
      }
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 8;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 40;
      lfo.connect(lfoG);
      lfo.start(t);
      lfo.stop(t + 1.8);
      for (const cents of [-16, 0, 19]) {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.detune.value = cents;
        o.frequency.setValueAtTime(360, t);
        o.frequency.exponentialRampToValueAtTime(980, t + 0.28);
        o.frequency.exponentialRampToValueAtTime(560, t + 1.6);
        lfoG.connect(o.frequency);
        o.connect(sg);
        o.start(t);
        o.stop(t + 1.8);
      }
      const bo = ctx.createOscillator();
      const bg = ctx.createGain();
      bo.type = 'sine';
      bo.frequency.setValueAtTime(72, t);
      bo.frequency.exponentialRampToValueAtTime(26, t + 0.9);
      bg.gain.setValueAtTime(0, t);
      bg.gain.linearRampToValueAtTime(1.1 * power, t + 0.01);
      bg.gain.exponentialRampToValueAtTime(0.001, t + 1);
      bo.connect(bg);
      bg.connect(n.hit);
      bo.start(t);
      bo.stop(t + 1.05);
    },
    ring(seconds = 2.5, power = 1) {
      if (!n) return;
      const t = ctx.currentTime;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06 * power, t + 0.08);
      g.gain.setValueAtTime(0.06 * power, t + seconds * 0.4);
      g.gain.exponentialRampToValueAtTime(0.0005, t + seconds);
      g.connect(n.hit);
      for (const f of [5400, 5432]) {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f;
        o.connect(g);
        o.start(t);
        o.stop(t + seconds + 0.05);
      }
    },
    whisper(power = 1) {
      if (!n) return;
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = n.noiseBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 2600;
      bp.Q.value = 1.4;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.7 * power, t + 0.25);
      g.gain.linearRampToValueAtTime(0, t + 1.1);
      src.connect(bp);
      bp.connect(g);
      g.connect(n.out);
      src.start(t);
      src.stop(t + 1.2);
    },
    destroy() {
      clearInterval(watchdog);
      if (ctx) {
        try {
          n.master.gain.value = 0;
        } catch {
        }
        ctx.close?.().catch(() => {});
      }
      n = null;
      ctx = null;
    },
  };
  return api;
}
