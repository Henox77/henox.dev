import './Art.css';

const BARS = Array.from({ length: 38 }, (_, i) => ({
  h: 0.22 + 0.78 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)),
  d: 0.9 + (i % 5) * 0.16,
  delay: -((i % 9) * 0.13),
}));

export default function Art() {
  return (
    <div className="wave-art">
      {BARS.map((b, i) => (
        <span key={i} className="wave-bar" style={{ '--h': b.h, '--d': `${b.d}s`, animationDelay: `${b.delay}s` }} />
      ))}
    </div>
  );
}
