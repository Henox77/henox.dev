import ArtSvg from '../ArtSvg.jsx';

export default function Art() {
  return (
    <ArtSvg viewBox="0 0 120 120">
      <rect x="20" y="55" width="45" height="25" />
      <path d="M65 62 L85 62 L95 80 L65 80 Z" />
      <circle cx="38" cy="82" r="10" />
      <circle cx="80" cy="82" r="10" />
      <line x1="20" y1="55" x2="10" y2="40" strokeWidth="4" />
      <line x1="10" y1="40" x2="10" y2="55" strokeWidth="3" />
    </ArtSvg>
  );
}
