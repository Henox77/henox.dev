import { skinById, swatchOf } from '../../../config/skins.js';
import useSkin from '../../../lib/useSkin.js';

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');

export default function SkinButton({ onClick, variant = 'icon' }) {
  const { choice, skin, theme } = useSkin();
  const def = skinById(skin) ?? skinById('henox');
  const colors = swatchOf(def, theme);
  const name = choice === 'auto' ? `auto · ${def.label}` : def.label;
  const key = isMac() ? '⌘K' : 'Ctrl K';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label={`Change site skin, current: ${name} (Ctrl+K)`}
      title={variant === 'icon' ? undefined : 'change skin · Ctrl+K'}
      className={`skin-btn skin-btn--${variant}`}
    >
      <span className="skin-btn-chip" aria-hidden="true">
        {colors.map((c, i) => (
          <i key={i} style={{ background: c }} />
        ))}
      </span>
      {variant === 'icon' ? (
        <span className="skin-btn-tip" aria-hidden="true">
          {name}
          <kbd className="skin-btn-kbd">{key}</kbd>
        </span>
      ) : (
        <>
          <span className="skin-btn-name">{name}</span>
          {variant === 'pill' ? (
            <kbd className="skin-btn-kbd" aria-hidden="true">
              {key}
            </kbd>
          ) : (
            <span className="skin-btn-go" aria-hidden="true">change →</span>
          )}
        </>
      )}
    </button>
  );
}
