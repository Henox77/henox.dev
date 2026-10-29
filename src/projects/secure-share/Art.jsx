import ArtSvg from '../ArtSvg.jsx';

export default function Art() {
  return (
    <ArtSvg viewBox="0 0 120 120">
      <rect x="30" y="44" width="60" height="50" rx="8" />
      <path d="M44 44 V34 A16 16 0 0 1 76 34 V44" fill="none" strokeWidth="6" />
      <circle cx="60" cy="66" r="6" fill="currentColor" />
      <line x1="60" y1="72" x2="60" y2="82" strokeWidth="4" />
    </ArtSvg>
  );
}
