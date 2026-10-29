import ArtSvg from '../ArtSvg.jsx';

export default function Art() {
  return (
    <ArtSvg viewBox="0 0 120 120">
      <rect x="25" y="25" width="70" height="70" rx="10" />
      <path d="M40 45 L52 60 L40 75" />
      <line x1="58" y1="75" x2="72" y2="75" />
    </ArtSvg>
  );
}
