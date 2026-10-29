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
  const { dict } = useLang();

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
    <section className="sig-wrap pt-20 pb-16 flex justify-center overflow-x-clip" aria-label="Signature">
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label="Toggle signature"
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={`sig-card relative p-7 bg-inset border border-line rounded-[12px] flex items-center justify-center transition-[border-color,box-shadow] duration-300 ${
          open ? 'border-amber shadow-[0_0_24px_-6px_var(--glow)]' : ''
        }`}
      >
        <span
          className="sig-top absolute left-1/2 -translate-x-1/2 -top-2 font-mono text-[10px] uppercase bg-panel px-2 tracking-[0.08em] whitespace-nowrap"
          style={{ color: 'var(--amber)' }}
        >
          {site.name}
        </span>

        <div className="sig-content flex flex-col items-center justify-center gap-1.5 min-w-[200px]">
          <div className="flex flex-col items-center gap-2">
            <div className="sig-draw-wrap h-14 w-full flex items-center justify-center" aria-hidden="true">
              <svg viewBox="0 0 200 45" className="h-10 w-auto overflow-visible select-none pointer-events-none">
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="central"
                  textAnchor="middle"
                  className={`sig-text font-serif italic text-2xl tracking-wide fill-none stroke-amber transition-all duration-1000 ${
                    drawn ? 'sig-drawn' : ''
                  }`}
                  style={{
                    strokeWidth: '1.5px',
                    strokeDasharray: '400',
                    strokeDashoffset: drawn ? '0' : '400',
                  }}
                >
                  {site.name}
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
