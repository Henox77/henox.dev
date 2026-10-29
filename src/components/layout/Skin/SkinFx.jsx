import { useEffect, useRef, useState } from 'react';
import { skinById } from '../../../config/skins.js';
import { site } from '../../../config/site.js';
import useSkin from '../../../lib/useSkin.js';
import { isPaused } from '../../../lib/nap.js';
import { prefersReducedMotion } from '../../../lib/env.js';
import { onThemeChange } from '../../../lib/themeSync.js';

const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789{}<>/=;:+*';
const SIZE = 16;
const STEP_MS = 70;

function MatrixRain() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let drops = [];
    let raf = 0;
    let last = 0;
    let head = '#ccffd8';
    let body = '#00ff41';

    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      head = css.getPropertyValue('--amber').trim() || head;
      body = css.getPropertyValue('--glow').trim() || body;
    };
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      ctx.font = `${SIZE}px monospace`;
      drops = Array.from({ length: Math.ceil(w / SIZE) }, () => Math.random() * -40);
    };
    const draw = () => {

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * SIZE;
        if (y > 0) {
          ctx.fillStyle = body;
          ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * SIZE, y - SIZE);
          ctx.fillStyle = head;
          ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * SIZE, y);
        }
        drops[i] = y > h && Math.random() > 0.975 ? Math.random() * -20 : drops[i] + 1;
      }
    };
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (t - last < STEP_MS || isPaused()) return;
      last = t;
      draw();
    };

    readColors();
    resize();
    if (reduce) {
      for (let i = 0; i < 40; i++) draw();
    } else {
      raf = requestAnimationFrame(loop);
    }
    const off = onThemeChange(readColors);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      off();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="skin-fx-rain" aria-hidden="true" />;
}

function RetroTray() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return (
    <>
      <span className="rt-task">{site.handle}</span>
      <span className="rt-clock">
        {hh}:{mm}
      </span>
    </>
  );
}

export default function SkinFx() {
  const { skin } = useSkin();
  const name = (skinById(skin)?.label ?? skin).toUpperCase();
  return (
    <>
      <div className="skin-fx-back" aria-hidden="true" />
      <div className="skin-fx-top" aria-hidden="true" data-name={name}>
        {skin === 'retro-os' && <RetroTray />}
      </div>
      {skin === 'matrix' && <MatrixRain />}
    </>
  );
}
