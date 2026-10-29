import ArtSvg from '../ArtSvg.jsx';

export default function Art() {
  return (
    <ArtSvg viewBox="0 0 120 120">
      <rect x="28" y="20" width="64" height="80" rx="8" />
      <circle cx="60" cy="50" r="16" />
      <circle cx="60" cy="50" r="6" fill="currentColor" />
      <line x1="38" y1="80" x2="82" y2="80" />
    </ArtSvg>
  );
}
