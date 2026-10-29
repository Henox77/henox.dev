import './Socials.css';
import { socials } from '../../../data/socials.js';
import { useLang } from '../../../context/LangContext.jsx';

function SocialButton({ name, href, brand, viewBox, path, zalo }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={name}
      className="social-icon relative flex flex-col items-center gap-2.5 w-[76px]"
    >
      <span className="social-btn relative flex items-center justify-center w-[52px] h-[52px] rounded-[10px] transition-transform duration-300">
        <span className="social-btn-icon relative z-10 flex items-center justify-center w-full h-full rounded-[11px] border text-white">
          <svg viewBox={viewBox} className="w-[22px] h-[22px]" fill="currentColor">
            {zalo ? (
              <>
                <path
                  d="M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H9l-4.5 3.5V17H4a1 1 0 01-1-1V5a1 1 0 011-1z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  fill="none"
                />
                <text x="12" y="13.5" fontSize="7.5" fontWeight="700" fill="currentColor" textAnchor="middle">
                  Z
                </text>
              </>
            ) : (
              <path d={path} />
            )}
          </svg>
        </span>
        <span className="social-btn-bg absolute inset-0 z-0 rounded-[11px] pointer-events-none" style={{ background: brand }} />
      </span>
      <span className="social-label font-mono text-xs text-dim">{name}</span>
    </a>
  );
}

export default function Socials() {
  const { lang } = useLang();
  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-mono text-[13px] text-dim mb-6">
        {lang === 'tr' ? 'Beni diğer platformlarda takip et:' : 'Find me across the web:'}
      </p>
      <div className="flex flex-wrap gap-8 justify-center">
        {socials.map((s) => (
          <SocialButton key={s.name} {...s} />
        ))}
      </div>
    </div>
  );
}
