import { useLang } from '../../../context/LangContext.jsx';

export default function LangToggle({ className = '', variant = 'button' }) {
  const { lang, toggleLang } = useLang();
  const target = lang === 'tr' ? 'EN' : 'TR';
  const current = lang === 'tr' ? 'TR' : 'EN';

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={toggleLang}
        className={`mobile-menu-link flex items-center justify-between w-full font-mono text-[13px] ${className}`}
        aria-label={`Current language: ${current}. Click to switch to ${target}`}
      >
        <span>
          language: <strong className="text-amber">{current}</strong>
        </span>
        <span className="text-dim text-[11px] border border-line px-1.5 py-0.5 rounded">
          → {target}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLang}
      title={`Language: ${current} (Click to switch to ${target})`}
      aria-label={`Language switch: currently ${current}, click for ${target}`}
      className={`font-mono text-[12px] px-2 py-1 rounded border border-line bg-panel text-ink hover:border-amber hover:text-amber transition-colors flex items-center gap-1 cursor-pointer select-none ${className}`}
    >
      <span className={lang === 'tr' ? 'text-amber font-bold' : 'text-dim'}>TR</span>
      <span className="text-dim opacity-40">/</span>
      <span className={lang === 'en' ? 'text-amber font-bold' : 'text-dim'}>EN</span>
    </button>
  );
}
