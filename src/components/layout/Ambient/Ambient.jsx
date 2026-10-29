import './Ambient.css';

const seeded = (i, k) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const DOTS = Array.from({ length: 14 }, (_, i) => ({
  x: Math.round(seeded(i, 1) * 96 + 2),
  y: Math.round(seeded(i, 2) * 90 + 4),
  s: 2 + Math.round(seeded(i, 3) * 2),
  d: 14 + Math.round(seeded(i, 4) * 16),
  delay: -Math.round(seeded(i, 5) * 20),
  dx: Math.round((seeded(i, 6) - 0.5) * 140),
  dy: Math.round((seeded(i, 7) - 0.8) * 120),
}));

export default function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      {DOTS.map((p, i) => (
        <i key={i} style={{ '--x': `${p.x}%`, '--y': `${p.y}%`, '--s': `${p.s}px`, '--d': `${p.d}s`, '--delay': `${p.delay}s`, '--dx': `${p.dx}px`, '--dy': `${p.dy}px` }} />
      ))}
    </div>
  );
}
