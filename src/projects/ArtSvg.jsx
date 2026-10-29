import './Projects.css';

export default function ArtSvg({ viewBox = '0 0 120 120', width = 96, height = 96, children }) {
  return (
    <div className="art-center">
      <svg
        viewBox={viewBox}
        width={width}
        height={height}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {children}
      </svg>
    </div>
  );
}
