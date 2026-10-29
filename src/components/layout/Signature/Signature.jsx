import { useEffect, useRef, useState } from 'react';
import './Signature.css';
import { site } from '../../../config/site.js';
import { observeOnce } from '../../../lib/observe.js';
import { useLang } from '../../../context/LangContext.jsx';

export function Signature() {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const [open, setOpen] = useState(false);
  const pointer = useRef('mouse');
  const { dict, lang } = useLang();

  useEffect(() => {
    return observeOnce(ref.current, () => setDrawn(true), 0.4);
  }, []);

  const isMouse = (e) => e.pointerType === 'mouse';
  const onClick = () => pointer.current !== 'mouse' && setOpen((o) => !o);
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  return (
    <section id="signature" className="py-20 border-t border-line">
      <div className="wrap max-w-[1040px] mx-auto px-8 flex justify-center">
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          aria-pressed={open}
          aria-label={`${site.realName}, ${site.handle}`}
          className={`sig-card relative w-[300px] h-[190px] bg-panel grid place-content-center rounded-[10px] overflow-hidden transition-all duration-500${
            open ? ' is-open' : ''
          }`}
          onPointerEnter={(e) => isMouse(e) && setOpen(true)}
          onPointerLeave={(e) => isMouse(e) && setOpen(false)}
          onPointerDown={(e) => (pointer.current = e.pointerType)}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onBlur={() => setOpen(false)}
        >
          <div className="sig-border absolute inset-0 border-2 rounded-[10px]" style={{ borderColor: 'var(--amber)' }} />
          <div className="text-center">
            <div className="sig-logo mx-auto mb-1">
              <svg viewBox="0 0 200 74" className={`sig-svg${drawn ? ' is-drawn' : ''}`} aria-hidden="true">

                <path className="sig-v" d="M14 16 L14 58 M14 37 L40 37 M40 16 L40 58" pathLength="100" />
                <path className="sig-bar" d="M40 16 H194" pathLength="100" />
                <text className="sig-rest" x="52" y="58" textLength="136" lengthAdjust="spacing">
                  {site.name.slice(1)}
                </text>
              </svg>
            </div>
            <span className="font-mono text-[13px] text-dim tracking-[0.14em]">{site.handle}</span>
          </div>
          <span
            className="sig-bottom absolute left-1/2 -translate-x-1/2 bottom-3.5 font-mono text-[9px] uppercase bg-panel px-1.5 whitespace-nowrap"
            style={{ color: 'var(--amber)' }}
          >
            {dict.footer.handcrafted}
          </span>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { dict } = useLang();
  return (
    <footer className="py-10 text-center font-mono text-[12.5px] text-dim border-t border-line flex flex-col items-center justify-center gap-3.5">
      <div>
        <img
          src="/henox.png"
          alt="Henox"
          className="h-[31px] w-[88px] object-contain"
        />
      </div>
      <p>{dict.footer.copy}</p>
    </footer>
  );
}
