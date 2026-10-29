import { TECH_ICONS } from '../../config/tech-icons.js';

export default function TechIcon({ name }) {
  const d = TECH_ICONS[name];
  if (!d) return <span className="chip-dot" aria-hidden="true" />;
  return (
    <svg className="chip-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}
