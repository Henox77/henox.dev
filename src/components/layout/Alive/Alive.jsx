import { useEffect, useRef, useState } from 'react';
import Battery from './Battery.jsx';
import { setNapState } from '../../../lib/nap.js';
import { prefersReducedMotion } from '../../../lib/env.js';
import { site } from '../../../config/site.js';
import { viewFromLocation } from '../../../config/pages.js';
import { pick, randInt, TAU } from '../../../lib/math.js';
import { emitReaction } from '../../../lib/reactions.js';
import './Alive.css';

const NAP_MS = 45000;
const AWAY_TITLES = ['psst. still here.', 'come back :(', `${site.handle} misses you`, 'did you leave?'];
const POP_CHARS = ['{', '}', '</>', '0', '1', ';', '*', '()', '=>'];
const POP_SKIP = 'a,button,input,textarea,select,label,canvas,summary,[role="button"],[contenteditable],.hero-full,.no-pop';

const BOUNCE_COLORS = ['var(--amber)', '#7ee787', '#79c0ff', '#ff7b72', '#d2a8ff'];
function Bouncer() {
  const el = useRef(null);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const node = el.current;
    const bw = node.offsetWidth;
    const bh = node.offsetHeight;
    let x = Math.random() * Math.max(1, window.innerWidth - bw);
    let y = Math.random() * Math.max(1, window.innerHeight - bh);
    let vx = (Math.random() < 0.5 ? -1 : 1) * 150;
    let vy = (Math.random() < 0.5 ? -1 : 1) * 110;
    let c = 0;
    let last = 0;
    let raf = 0;
    let msgTimer = 0;
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      x += vx * dt;
      y += vy * dt;
      const mx = Math.max(0, window.innerWidth - bw);
      const my = Math.max(0, window.innerHeight - bh);
      let hx = false;
      let hy = false;
      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
        hx = true;
      } else if (x >= mx) {
        x = mx;
        vx = -Math.abs(vx);
        hx = true;
      }
      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
        hy = true;
      } else if (y >= my) {
        y = my;
        vy = -Math.abs(vy);
        hy = true;
      }
      if (hx || hy) {
        c = (c + 1) % BOUNCE_COLORS.length;
        node.style.color = BOUNCE_COLORS[c];
      }
      if (hx && hy) {
        setMsg('corner!!');
        clearTimeout(msgTimer);
        msgTimer = window.setTimeout(() => setMsg(''), 1800);
      }
      node.style.transform = `translate(${x}px, ${y}px)`;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(msgTimer);
    };
  }, []);
  return (
    <div ref={el} className="bouncer" aria-hidden="true">
      {site.handle}<i />
      {msg && <span className="bouncer-msg">{msg}</span>}
    </div>
  );
}

export default function Alive() {
  const [nap, setNap] = useState('awake');
  const [meeting, setMeeting] = useState(false);

  useEffect(() => {
    let saved = null;
    let timer = 0;
    const onVis = () => {
      clearTimeout(timer);
      if (document.hidden) {
        if (saved === null) saved = document.title;
        document.title = pick(AWAY_TITLES);
      } else if (saved !== null) {
        document.title = 'oh. hi again.';
        timer = window.setTimeout(() => {
          document.title = saved;
          saved = null;
        }, 1600);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let last = performance.now();
    let state = 'awake';
    let wakeTimer = 0;
    let idleTimer = 0;
    const arm = () => {
      clearTimeout(idleTimer);
      idleTimer = 0;
      if (state !== 'awake' || document.hidden) return;
      idleTimer = window.setTimeout(() => {
        idleTimer = 0;
        if (performance.now() - last >= NAP_MS) set('nap');
        else arm();
      }, Math.max(50, NAP_MS - (performance.now() - last)));
    };
    const set = (s) => {
      state = s;
      setNap(s);
      setNapState(s);
      arm();
    };
    const poke = () => {
      last = performance.now();
      if (state === 'nap') {
        set('wake');
        clearTimeout(wakeTimer);
        wakeTimer = window.setTimeout(() => set('awake'), 1700);
      }
    };
    const onVisible = () => {
      if (!document.hidden) last = performance.now();
      arm();
    };
    document.addEventListener('visibilitychange', onVisible);
    const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];
    evs.forEach((e) => window.addEventListener(e, poke, { passive: true }));
    arm();
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearTimeout(idleTimer);
      clearTimeout(wakeTimer);
      evs.forEach((e) => window.removeEventListener(e, poke));
      setNapState('awake');
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let live = 0;
    const onClick = (e) => {
      if (e.button !== 0 || e.target.closest(POP_SKIP) || window.getSelection()?.toString()) return;
      if (viewFromLocation().startsWith('lab/') || live > 24) return;
      const n = randInt(5, 7);
      for (let i = 0; i < n; i++) {
        const el = document.createElement('span');
        el.textContent = pick(POP_CHARS);
        el.setAttribute('aria-hidden', 'true');
        el.className = 'pop-char';
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        document.body.appendChild(el);
        const a = (TAU * i) / n + Math.random() * 0.8 - 0.4;
        const d = 34 + Math.random() * 46;
        live++;
        const anim = el.animate(
          [
            { transform: 'translate(-50%,-50%) scale(0.6)', opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 18}px)) scale(1)`, opacity: 1, offset: 0.55 },
            { transform: `translate(calc(-50% + ${Math.cos(a) * d * 1.1}px), calc(-50% + ${Math.sin(a) * d + 22}px)) scale(0.9)`, opacity: 0 },
          ],
          { duration: 750 + Math.random() * 250, easing: 'cubic-bezier(.2,.7,.3,1)' }
        );
        anim.onfinish = () => {
          el.remove();
          live--;
        };
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const times = [];
    let cool = 0;
    let hide = 0;
    const mo = new MutationObserver((recs) => {
      for (const r of recs) {
        if (r.oldValue === document.documentElement.dataset.theme) continue;
        if (document.documentElement.hasAttribute('data-skin-swap')) continue;
        const now = performance.now();
        times.push(now);
        while (times.length && now - times[0] > 4000) times.shift();
        if (times.length >= 4 && now > cool) {
          cool = now + 12000;
          times.length = 0;
          setMeeting(true);
          emitReaction('meeting');
          clearTimeout(hide);
          hide = window.setTimeout(() => setMeeting(false), 3000);
        }
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'], attributeOldValue: true });
    return () => {
      mo.disconnect();
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!meeting) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMeeting(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [meeting]);

  return (
    <>
      <Battery napping={nap === 'nap'} panic={meeting} />
      <div className={`nap-dim${nap === 'nap' ? ' is-on' : ''}`} aria-hidden="true" />

      {nap === 'nap' &&
        (prefersReducedMotion() ? (
          <div className="nap-bubble" role="status">
            {site.handle} is napping. wiggle the mouse.
          </div>
        ) : (
          <Bouncer />
        ))}
      {nap === 'wake' && (
        <div className="nap-bubble" role="status">
          oh. hi.
        </div>
      )}

      {meeting && (
        <div className="meeting" role="alertdialog" aria-label="Emergency meeting" onClick={() => setMeeting(false)}>
          <div className="meeting-box">
            <div className="meeting-title">EMERGENCY MEETING</div>
            <div className="meeting-sub">someone keeps flipping the lights. sus.</div>
            <div className="meeting-hint">click or press esc to vote</div>
          </div>
        </div>
      )}
    </>
  );
}
