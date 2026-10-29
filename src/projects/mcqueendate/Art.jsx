import ArtSvg from '../ArtSvg.jsx';

export default function Art() {
  return (
    <ArtSvg viewBox="0 0 120 120">
      <path d="M25 70 Q35 45 60 45 Q85 45 95 70 Z" />
      <circle cx="42" cy="74" r="10" />
      <circle cx="78" cy="74" r="10" />
      <path d="M50 56 L65 52 L57 60 L70 56" stroke="currentColor" fill="none" strokeWidth="2" />
    </ArtSvg>
  );
}
