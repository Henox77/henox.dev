import './Art.css';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const CELLS = Array.from({ length: 35 }, (_, i) => i);
const ON = new Set([5, 8, 13, 14, 19]);

function todayCell(now) {
  const col = (now.getDay() + 6) % 7;
  const offset = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
  let row = Math.floor((now.getDate() + offset - 1) / 7) % 2;
  if (row === 1 && col === 3) row = 0;
  return { col, index: row * 7 + col };
}

export default function Art() {
  const { col: todayCol, index: todayIndex } = todayCell(new Date());

  return (
    <div className="cal-art">
      <div className="cal-grid">
        {DAYS.map((d, i) => (
          <span key={d} className={`cal-head${i === todayCol ? ' today' : ''}`} />
        ))}
        {CELLS.map((i) => (
          <span key={i} className={`cal-cell${ON.has(i) && i !== todayIndex ? ' on' : ''}${i === todayIndex ? ' today' : ''}`}>
            {i === todayIndex && <span className="cal-stamp">{DAYS[todayCol]}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}