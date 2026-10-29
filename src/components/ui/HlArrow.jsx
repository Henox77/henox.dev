const ROT = { right: 0, down: 90, ne: -45 };

export default function HlArrow({ dir = 'right' }) {
  return (
    <svg
      className="hl-arrow"
      viewBox="0 0 18 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform={`rotate(${ROT[dir]} 9 8)`}>
        <path className="hl-arrow-shaft" d="M2 8H13" />
        <path className="hl-arrow-head" d="M9 4L13 8L9 12" />
      </g>
    </svg>
  );
}
