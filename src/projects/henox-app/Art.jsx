import ArtSvg from '../ArtSvg.jsx';

export default function Art() {
  return (
    <ArtSvg viewBox="0 0 120 120">
      <rect x="20" y="24" width="80" height="72" rx="8" />
      <line x1="20" y1="44" x2="100" y2="44" />
      <circle cx="32" cy="34" r="3" fill="currentColor" />
      <circle cx="44" cy="34" r="3" fill="currentColor" />
      <path d="M56 60 L68 70 L56 80" />
      <line x1="74" y1="80" x2="84" y2="80" />
    </ArtSvg>
  );
}
