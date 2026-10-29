import { useEffect, useState } from 'react';
import { mainStack, learning } from '../../data/profile.js';
import { site } from '../../config/site.js';
import { spotMove } from '../../lib/dom.js';
import { gmtLabel, siteClock } from '../../lib/siteTime.js';
import { cycleStatus, useStatus } from '../../lib/status.js';
import { useKonami } from '../../lib/konami.js';
import { pausableInterval } from '../../lib/timers.js';
import { BATTERY_CELLS, friendship, isAsleep, levelOf, sayHi, toneOf, unlockKonami, useSocial } from '../../lib/social.js';
import { useLang } from '../../context/LangContext.jsx';

const TONE_COLOR = { hi: 'var(--green)', mid: 'var(--amber)', lo: 'var(--danger)' };

function Meter({ value, color, rainbow }) {
  const on = Math.round((value / 100) * BATTERY_CELLS);
  return (
    <div className={`flex gap-[3px] ${rainbow ? 'sheet-rainbow' : ''}`} role="img" aria-label={`${value}%`}>
      {Array.from({ length: BATTERY_CELLS }, (_, i) => (
        <span
          key={i}
          className="h-3 flex-1 rounded-[2px] transition-colors duration-300"
          style={{ background: i < on ? (rainbow ? `hsl(${i * 36} 85% 62%)` : color) : 'var(--line)' }}
        />
      ))}
    </div>
  );
}

const Row = ({ k, children }) => (
  <div className="grid grid-cols-[84px_1fr] gap-3">
    <span className="text-dim">{k}</span>
    <span className="text-ink">{children}</span>
  </div>
);

export default function SheetCard() {
  const status = useStatus();
  const { drain, months, maxed, reply } = useSocial();
  const { dict, lang } = useLang();
  const [time, setTime] = useState(siteClock);
  const [cls, setCls] = useState(0);

  const roleLabel = lang === 'tr' ? site.roleTr : site.roleEn;
  const locationLabel = lang === 'tr' ? site.locationTr : site.locationEn;
  const classesList = [null, ...(dict.card.classes || site.content.classes)];

  useEffect(() => pausableInterval(() => setTime(siteClock()), 1000), []);

  useKonami(unlockKonami);

  const level = levelOf({ drain, maxed }, status.key);
  const empty = isAsleep({ drain, maxed }, status.key);
  const color = TONE_COLOR[toneOf(level)];

  return (
    <aside
      onMouseMove={spotMove}
      className={`spot bg-inset border rounded-[10px] overflow-hidden font-mono text-[13px] transition-[border-color,box-shadow] duration-500 ${
        maxed
          ? 'border-amber shadow-[0_0_44px_-8px_var(--glow)]'
          : 'border-line shadow-[0_20px_60px_-20px_rgb(var(--shade)/calc(0.6_*_var(--shade-k)))]'
      }`}
    >
      <div className="bg-panel px-4 py-2.5 border-b border-line flex items-center justify-between">
        <span className="text-dim">{maxed ? `${site.id}.sav [MAX]` : `${site.id}.sav`}</span>
        <button
          type="button"
          onClick={cycleStatus}
          className="touch-hit font-pixel text-[10px] flex items-center gap-2 cursor-pointer"
          style={{ color: status.color }}
          title={lang === 'tr' ? 'Durumu değiştirmek için tıkla (oto → meşgul → odak → çevrimdışı)' : 'Click to change status (auto → busy → focus → offline)'}
        >
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: status.color }} />
          {status.key}
          {status.isAuto && <span className="opacity-60">{dict.card.statusAuto}</span>}
        </button>
      </div>

      <div className="p-4 grid gap-2 leading-relaxed">
        <Row k="class">
          <button
            type="button"
            onClick={() => setCls((c) => (c + 1) % classesList.length)}
            title={dict.card.classTitle}
            className="touch-hit text-left cursor-pointer hover:text-amber transition-colors"
          >
            {classesList[cls] ?? roleLabel} <span className="text-dim">↻</span>
          </button>
        </Row>
        <Row k={dict.card.location}>
          {locationLabel} <span className="text-dim">· {time} {gmtLabel()}</span>
        </Row>
        <Row k={dict.card.mainQuest}>{mainStack}</Row>
        <Row k={dict.card.sideQuest}>{learning}</Row>

        <div className="mt-2 grid gap-1.5">
          <div className="flex justify-between">
            <span className="text-dim">{dict.card.socialBattery}</span>
            <span style={{ color }}>{level}%</span>
          </div>
          <Meter value={level} color={color} rainbow={maxed} />
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={friendship}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              friendship();
            }
          }}
          title="???"
          className="grid gap-1.5 cursor-pointer select-none"
        >
          <div className="flex justify-between">
            <span className="text-dim">{dict.card.personality}</span>
            <span className="text-amber">{maxed ? 100 : 12 + months}%</span>
          </div>
          <Meter value={maxed ? 100 : 12 + months} color="var(--amber)" rainbow={maxed} />
          <span className="text-dim text-[12px]">{dict.card.personalityHint}</span>
        </div>

        <div className="flex items-start gap-3 mt-2">
          <button
            type="button"
            onClick={sayHi}
            disabled={empty}
            className="px-3 py-1.5 border border-line rounded-sm text-ink hover:border-amber hover:text-amber disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {dict.card.sayHi}
          </button>
          <span className="text-dim text-[12.5px] leading-snug pt-1.5 min-h-[2.8em] min-w-0 flex-1" aria-live="polite">
            {reply || (empty ? dict.card.sleepingNote : '')}
          </span>
        </div>
      </div>
    </aside>
  );
}
