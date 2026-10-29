
import { PANEL } from '../../../config/ui.js';

const GAME_BTN = 'lab-cell px-3.5 py-1.5 rounded-md border border-line hover:border-amber text-ink';

export const gameAction = (status, onClick) => ({
  onClick,
  label: status === 'playing' ? 'restart' : status === 'over' ? 'play again' : 'start',
});

export function GameFrame({ stats, action, children }) {
  return (
    <div className={PANEL}>
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[13px] mb-5">
        <div className="flex gap-5">
          {stats.map((s) => (
            <span key={s.label}>
              <span className="text-dim">{s.label} </span>
              <span style={s.color ? { color: s.color } : undefined}>{s.value}</span>
            </span>
          ))}
        </div>
        <button type="button" onClick={action.onClick} className={GAME_BTN}>
          {action.label}
        </button>
      </div>
      {children}
    </div>
  );
}

export function GameOverlay({ children }) {
  return (
    <div
      className="absolute inset-0 rounded-lg flex flex-col items-center justify-center text-center gap-2 font-mono text-[13px] px-4"
      style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)' }}
    >
      {children}
    </div>
  );
}
