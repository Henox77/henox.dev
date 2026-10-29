export default function Zzz({ show }) {
  if (!show) return null;
  return (
    <span className="pet-zzz" aria-hidden="true">
      <i>z</i>
      <i>z</i>
      <i>Z</i>
    </span>
  );
}
