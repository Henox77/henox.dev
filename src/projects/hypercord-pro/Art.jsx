import ArtSvg from '../ArtSvg.jsx';

export default function Art() {
  return (
    <ArtSvg viewBox="0 0 120 120">
      <rect x="22" y="32" width="76" height="56" rx="14" />
      <circle cx="44" cy="56" r="6" fill="currentColor" />
      <circle cx="76" cy="56" r="6" fill="currentColor" />
      <path d="M50 72 Q60 78 70 72" />
      <line x1="40" y1="24" x2="48" y2="32" />
      <line x1="80" y1="24" x2="72" y2="32" />
    </ArtSvg>
  );
}
