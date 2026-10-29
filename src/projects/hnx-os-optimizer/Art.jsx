import ArtSvg from '../ArtSvg.jsx';

export default function Art() {
  return (
    <ArtSvg viewBox="0 0 120 120">
      <path d="M26 84 A46 46 0 1 1 94 84" />
      <line x1="60" y1="60" x2="80" y2="40" />
      <circle cx="60" cy="60" r="6" fill="currentColor" />
      <line x1="26" y1="84" x2="38" y2="76" />
      <line x1="94" y1="84" x2="82" y2="76" />
    </ArtSvg>
  );
}
