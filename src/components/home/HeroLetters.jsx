import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './HeroLetters.css';
import { site } from '../../config/site.js';
import { frameLoop } from '../../lib/loop.js';
import { prefersReducedMotion } from '../../lib/env.js';
import { observeOnce } from '../../lib/observe.js';
import { clamp, pick, rand, randInt } from '../../lib/math.js';
import { getSocial, isAsleep, onSocialChange } from '../../lib/social.js';

const CHARS = [...site.handle];
const HOT = site.id.length;
const STEP = 1000 / 60;
const MAX_STEPS = 3;
const DROP_MS = 90;
const KICK_PX = 5;
const KICK_MS = 250;
const G = 1.15;
const MAX_EXTRA = 24;
const TOKENS = ['{}', '()', '[]', ';', '=>', '</>', '//', '&&', '++', '0', '1', '*', '#', '~', '$', '404', 'null', 'NaN', 'git', 'bug', ':)'];
const SOLID = '[data-solid], [data-solid-kids] > *';
const PRELOADER_WAIT_MS = 6000;

function start(M, yard, els, bar) {
  const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = M;
  const hero = yard.parentElement;
  const engine = Engine.create({ enableSleeping: true, gravity: { y: G } });
  const world = engine.world;
  const n = els.length;
  const bodies = [];
  const extras = [];
  const timers = [];
  let walls = [];
  let solids = [];
  let solidSig = '';
  let solidDirty = false;
  let w = 0;
  let h = 0;
  let boxW = 0;
  let boxH = 0;
  let fontPx = 40;
  let zeroG = false;
  let lastUp = 0;
  let drag = null;
  let seen = getSocial();
  let seenHi = seen.hiAt;
  let seenMax = seen.maxAt;

  const buildWalls = () => {
    Composite.remove(world, walls);
    const T = 100;
    const o = { isStatic: true, friction: 0.6 };
    walls = [
      Bodies.rectangle(w / 2, h + T / 2, w + T * 2, T, o),
      Bodies.rectangle(-T / 2, h / 2, T, h * 3, o),
      Bodies.rectangle(w + T / 2, h / 2, T, h * 3, o),
      Bodies.rectangle(w / 2, -T / 2, w + T * 2, T, o),
    ];
    Composite.add(world, walls);
  };

  const all = () => [...bodies.filter(Boolean), ...extras.map((x) => x.body)];
  const place = (el, b, bw, bh) => {
    el.style.transform = `translate3d(${(b.position.x - bw / 2).toFixed(1)}px, ${(b.position.y - bh / 2).toFixed(1)}px, 0) rotate(${b.angle.toFixed(3)}rad)`;
  };
  const draw = () => {
    for (let i = 0; i < bodies.length; i++) place(els[i], bodies[i], boxW, boxH);
    for (const x of extras) place(x.el, x.body, x.w, x.h);
  };

  const resting = () => !zeroG && bodies.length === n && !drag && all().every((b) => b.isSleeping);
  let acc = 0;
  let last = 0;
  let ticks = 0;
  const tick = (t) => {
    acc += last ? Math.min(100, t - last) : STEP;
    last = t;
    let steps = 0;
    while (acc >= STEP && steps < MAX_STEPS) {
      Engine.update(engine, STEP);
      acc -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS) acc = 0;
    if (solidDirty || ++ticks % 24 === 0) {
      solidDirty = false;
      buildSolids();
    }
    draw();
    if (resting()) loop.sync();
  };
  const loop = frameLoop(tick, {
    watch: yard,
    canRun: () => !resting(),
    onResume: () => {
      last = 0;
      solidDirty = true;
    },
  });
  const wake = () => {
    all().forEach((b) => Sleeping.set(b, false));
    loop.sync();
  };

  const jump = (b, k = 1) => {
    Sleeping.set(b, false);
    Body.setVelocity(b, { x: rand(-3, 3) * k, y: -rand(7, 10) * k });
    Body.setAngularVelocity(b, rand(-0.25, 0.25) * k);
  };

  const measure = () => {
    const o = yard.getBoundingClientRect();
    return [...hero.querySelectorAll(SOLID)]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
      })
      .filter((r) => r.w > 4 && r.h > 4);
  };
  const buildSolids = (force = false) => {
    const list = measure();
    const sig = list.map((r) => `${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.w)},${Math.round(r.h)}`).join('|');
    if (!force && sig === solidSig) return;
    solidSig = sig;
    Composite.remove(world, solids);
    solids = list.map((r) =>
      Bodies.rectangle(r.x + r.w / 2, r.y + r.h / 2, r.w, r.h, {
        isStatic: true,
        friction: 0.6,
        chamfer: { radius: Math.min(10, r.h / 3) },
      })
    );
    Composite.add(world, solids);
    wake();
  };

  const layout = () => {
    w = yard.clientWidth;
    h = yard.clientHeight;
    const size = clamp(Math.round(Math.min(w, 1100) / 11), 30, 56);
    fontPx = size;
    boxW = Math.round(size * 0.68);
    boxH = Math.round(size * 1.2);
    yard.style.setProperty('--fs', `${size}px`);
    els.forEach((el) => {
      el.style.width = `${boxW}px`;
      el.style.height = `${boxH}px`;
    });
    buildWalls();
    buildSolids(true);
    all().forEach((b) => {
      const hw = (b.bounds.max.x - b.bounds.min.x) / 2;
      const hh = (b.bounds.max.y - b.bounds.min.y) / 2;
      Body.setPosition(b, { x: clamp(b.position.x, hw, w - hw), y: clamp(b.position.y, hh, h - hh) });
    });
    wake();
  };
  const ro = new ResizeObserver(layout);
  ro.observe(yard);
  layout();
  const roSolid = new ResizeObserver(() => (solidDirty = true));
  hero.querySelectorAll(SOLID).forEach((el) => roSolid.observe(el));

  const dropAll = () => {
    const kids = hero.querySelector('[data-solid-kids]');
    const o = yard.getBoundingClientRect();
    let cx = w / 2;
    if (kids?.firstElementChild) {
      const a = kids.firstElementChild.getBoundingClientRect();
      const z = kids.lastElementChild.getBoundingClientRect();
      cx = (a.left + z.right) / 2 - o.left;
    }
    CHARS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          const x = clamp(cx + (i - (n - 1) / 2) * boxW * 0.85 + rand(-8, 8), boxW, w - boxW);
          const b = Bodies.rectangle(x, boxH, boxW, boxH, {
            chamfer: { radius: 8 },
            restitution: zeroG ? 0.9 : 0.4,
            friction: 0.35,
            frictionAir: zeroG ? 0.004 : 0.012,
            density: 0.0018,
            sleepThreshold: 45,
          });
          Body.setAngle(b, rand(-0.7, 0.7));
          Body.setAngularVelocity(b, rand(-0.15, 0.15));
          bodies[i] = b;
          Composite.add(world, b);
          place(els[i], b, boxW, boxH);
          els[i].setAttribute('data-live', '');
          loop.sync();
        }, i * DROP_MS)
      );
    });
  };
  let waited = 0;
  const intro = () => {
    if (!document.getElementById('preloader') || (waited += 100) > PRELOADER_WAIT_MS) dropAll();
    else timers.push(setTimeout(intro, 100));
  };
  intro();
  yard.setAttribute('data-ready', '');
  bar?.setAttribute('data-ready', '');

  const local = (e) => {
    const r = yard.getBoundingClientRect();
    return { x: clamp(e.clientX - r.left, 0, w), y: clamp(e.clientY - r.top, 0, h) };
  };
  const grab = (el, getBody) => {
    const down = (e) => {
      const b = getBody();
      if (!b || drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
      el.setPointerCapture(e.pointerId);
      const p = local(e);
      const dx = p.x - b.position.x;
      const dy = p.y - b.position.y;
      const cos = Math.cos(b.angle);
      const sin = Math.sin(b.angle);
      const c = Constraint.create({
        pointA: p,
        bodyB: b,
        pointB: { x: dx * cos + dy * sin, y: -dx * sin + dy * cos },
        stiffness: 0.18,
        damping: 0.12,
        length: 0,
      });
      Composite.add(world, c);
      Sleeping.set(b, false);
      drag = { el, c, id: e.pointerId, x0: p.x, y0: p.y, t0: performance.now(), moved: false };
      el.setAttribute('data-held', '');
      bar?.setAttribute('data-touched', '');
      solidDirty = true;
      loop.sync();
    };
    const move = (e) => {
      if (!drag || drag.el !== el || e.pointerId !== drag.id) return;
      const p = local(e);
      drag.c.pointA = p;
      if (Math.hypot(p.x - drag.x0, p.y - drag.y0) > KICK_PX) drag.moved = true;
    };
    const up = (e) => {
      if (!drag || drag.el !== el || e.pointerId !== drag.id) return;
      Composite.remove(world, drag.c);
      el.removeAttribute('data-held');
      if (!drag.moved && performance.now() - drag.t0 < KICK_MS && getBody()) jump(getBody());
      drag = null;
      lastUp = performance.now();
      loop.sync();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  };
  const offGrabs = els.map((el, i) => grab(el, () => bodies[i]));

  const clearBtn = bar?.querySelector('[data-act="clear"]');
  const syncClear = () => {
    if (clearBtn) clearBtn.disabled = extras.length === 0;
  };
  const dropExtra = (x) => {
    const i = extras.indexOf(x);
    if (i >= 0) extras.splice(i, 1);
    if (drag && drag.el === x.el) {
      Composite.remove(world, drag.c);
      drag = null;
    }
    Composite.remove(world, x.body);
    x.off();
    x.el.style.opacity = '0';
    x.el.style.pointerEvents = 'none';
    timers.push(setTimeout(() => x.el.remove(), 400));
    syncClear();
  };
  const spawn = (px, py) => {
    const token = pick(TOKENS);
    const fs = Math.round(fontPx * rand(0.5, 0.78));
    const bw = Math.round(fs * 0.62 * token.length) + 12;
    const bh = Math.round(fs * 1.2);
    const el = document.createElement('span');
    el.className = 'letter letter-extra';
    el.textContent = token;
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-live', '');
    if (Math.random() < 0.45) el.setAttribute('data-hot', '');
    el.style.setProperty('--fs', `${fs}px`);
    el.style.setProperty('--i', String(randInt(0, 7)));
    el.style.width = `${bw}px`;
    el.style.height = `${bh}px`;
    const body = Bodies.rectangle(clamp(px, bw / 2, w - bw / 2), clamp(py, bh / 2, h - bh / 2), bw, bh, {
      chamfer: { radius: Math.min(8, bh / 4) },
      restitution: zeroG ? 0.9 : 0.45,
      friction: 0.3,
      frictionAir: zeroG ? 0.004 : 0.012,
      density: 0.0014,
      sleepThreshold: 45,
    });
    Body.setAngle(body, rand(-0.6, 0.6));
    Body.setVelocity(body, { x: rand(-3, 3), y: rand(-6, -1) });
    Body.setAngularVelocity(body, rand(-0.2, 0.2));
    const x = { el, body, w: bw, h: bh, off: () => {} };
    x.off = grab(el, () => x.body);
    place(el, body, bw, bh);
    yard.appendChild(el);
    Composite.add(world, body);
    extras.push(x);
    if (extras.length > MAX_EXTRA) dropExtra(extras[0]);
    syncClear();
    wake();
  };

  const setZeroG = (on) => {
    zeroG = on;
    engine.gravity.y = on ? 0 : G;
    engine.enableSleeping = !on;
    all().forEach((b) => {
      Sleeping.set(b, false);
      Body.set(b, 'restitution', on ? 0.9 : 0.4);
      Body.set(b, 'frictionAir', on ? 0.004 : 0.012);
      if (on) {
        Body.setVelocity(b, { x: rand(-2.5, 2.5), y: rand(-3.5, -1) });
        Body.setAngularVelocity(b, rand(-0.1, 0.1));
      }
    });
    bar?.querySelector('[data-act="zerog"]')?.setAttribute('aria-pressed', String(on));
    loop.sync();
  };
  const onBar = (e) => {
    const act = e.target.closest('[data-act]')?.getAttribute('data-act');
    if (!act) return;
    bar.setAttribute('data-touched', '');
    buildSolids();
    if (act === 'shake') {
      all().forEach((b) => jump(b, rand(0.8, 1.6)));
      loop.sync();
    } else if (act === 'zerog') {
      setZeroG(!zeroG);
    } else if (act === 'clear') {
      [...extras].forEach(dropExtra);
    }
  };
  bar?.addEventListener('click', onBar);
  const onHero = (e) => {
    if (e.target.closest('a, button, input, textarea, select, label, [data-solid], .letter')) return;
    if (performance.now() - lastUp < 80 || window.getSelection?.().toString()) return;
    bar?.setAttribute('data-touched', '');
    buildSolids();
    const p = local(e);
    spawn(p.x, p.y);
  };
  hero.addEventListener('click', onHero);

  const onSocial = () => {
    const s = getSocial();
    yard.toggleAttribute('data-asleep', isAsleep(s));
    yard.toggleAttribute('data-rainbow', s.maxed);
    if (s.hiAt !== seenHi) {
      seenHi = s.hiAt;
      all().forEach((b) => jump(b, 0.6));
      loop.sync();
    }
    if (s.maxAt !== seenMax) {
      seenMax = s.maxAt;
      all().forEach((b) => jump(b, 1.4));
      loop.sync();
    }
  };
  const offSocial = onSocialChange(onSocial);
  onSocial();

  return () => {
    timers.forEach(clearTimeout);
    loop.stop();
    ro.disconnect();
    roSolid.disconnect();
    offSocial();
    hero.removeEventListener('click', onHero);
    bar?.removeEventListener('click', onBar);
    offGrabs.forEach((off) => off());
    extras.forEach((x) => {
      x.off();
      x.el.remove();
    });
    Composite.clear(world, false);
    Engine.clear(engine);
  };
}

export default function HeroLetters({ slot }) {
  const yard = useRef(null);
  const bar = useRef(null);
  const letters = useRef([]);
  const [still] = useState(prefersReducedMotion);

  useEffect(() => {
    if (still) return undefined;
    let dead = false;
    let teardown = () => {};
    const stopWatch = observeOnce(
      yard.current,
      async () => {
        const mod = await import('matter-js');
        if (!dead) teardown = start(mod.default ?? mod, yard.current, letters.current, bar.current);
      },
      0.1
    );
    return () => {
      dead = true;
      stopWatch();
      teardown();
    };
  }, [still]);

  if (still) return null;
  return (
    <>
      <div ref={yard} className="letters-yard" aria-hidden="true">
        {CHARS.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              letters.current[i] = el;
            }}
            className="letter"
            data-hot={i < HOT || undefined}
            style={{ '--i': i }}
          >
            {ch}
          </span>
        ))}
      </div>
      {slot &&
        createPortal(
          <div ref={bar} className="letters-ctrl">
            <p className="letters-hint">{'this page is a toy. grab a letter, or click anywhere to drop more'}</p>
            <div className="letters-btns" role="group" aria-label="letter toys">
              <button type="button" data-act="shake">shake</button>
              <button type="button" data-act="zerog" aria-pressed="false">zero-g</button>
              <button type="button" data-act="clear" disabled>clear</button>
            </div>
          </div>,
          slot
        )}
    </>
  );
}
