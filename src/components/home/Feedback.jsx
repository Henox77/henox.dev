import { useState } from 'react';
import Btn31 from '../ui/Btn31/Btn31.jsx';
import { site } from '../../config/site.js';
import { emitReaction } from '../../lib/reactions.js';
import useTimer from '../../lib/useTimer.js';
import { useLang } from '../../context/LangContext.jsx';

const MAX_MAILTO = 1900;

const GOOD_FACE =
  'M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z';
const BAD_FACE =
  'M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z';

function MoodButton({ label, on, onClick, path }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={on}
      className={`w-[38px] h-[38px] flex items-center justify-center rounded-lg border transition-colors duration-300 ${
        on ? 'bg-amber border-amber' : 'bg-panel border-line text-dim hover:border-amber-dim hover:text-amber'
      }`}
      style={on ? { color: 'var(--on-amber)' } : undefined}
    >
      <svg viewBox="0 0 512 512" className="w-[18px] h-[18px]">
        <path fill="currentColor" d={path} />
      </svg>
    </button>
  );
}

export default function Feedback() {
  const { dict, lang } = useLang();
  const [text, setText] = useState('');
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const copiedT = useTimer();

  const moods = {
    good: {
      label: lang === 'tr' ? 'Bu sayfayı beğendim' : 'I like this page',
      tag: ' (liked it)',
      path: GOOD_FACE,
    },
    bad: {
      label: lang === 'tr' ? 'Pek beğenmedim' : 'Not a fan',
      tag: ' (not a fan)',
      path: BAD_FACE,
    },
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      emitReaction('copy');
      copiedT.set(() => setCopied(false), 2000);
    } catch {
      setNote(`${dict.contact.mailClientSuccess} ${site.email}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message) return;

    const subject = encodeURIComponent(`Feedback from ${site.handle}${moods[mood]?.tag ?? ''}`);
    const head = `mailto:${site.email}?subject=${subject}&body=`;
    let body = encodeURIComponent(message);
    let cut = false;
    if (head.length + body.length > MAX_MAILTO) {
      cut = true;
      const chars = Array.from(message);
      let n = chars.length;
      while (n > 0 && head.length + encodeURIComponent(chars.slice(0, n).join('')).length > MAX_MAILTO) n -= 50;
      body = encodeURIComponent(chars.slice(0, Math.max(n, 0)).join(''));
      navigator.clipboard?.writeText(message).catch(() => {});
    }
    window.location.href = head + body;

    setNote(
      cut
        ? `${dict.contact.tooLong} ${site.email}`
        : `${dict.contact.mailClientSuccess} ${site.email}`
    );
  };

  return (
    <div>
      <p className="font-mono text-[12.5px] text-dim mb-5">
        {dict.contact.subtitle}
      </p>
      <form onSubmit={handleSubmit} className="bg-inset border border-line rounded-[10px] p-5 flex flex-col gap-3.5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={dict.contact.placeholder}
          required
          aria-label={dict.contact.placeholder}
          className="w-full h-[120px] bg-panel border border-line rounded-lg p-3.5 font-mono text-[13px] text-ink placeholder:text-dim/60 focus:outline-none focus:border-amber transition-colors resize-none"
        />

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <MoodButton
              label={moods.good.label}
              on={mood === 'good'}
              onClick={() => setMood(mood === 'good' ? null : 'good')}
              path={moods.good.path}
            />
            <MoodButton
              label={moods.bad.label}
              on={mood === 'bad'}
              onClick={() => setMood(mood === 'bad' ? null : 'bad')}
              path={moods.bad.path}
            />
            <button
              type="button"
              onClick={copyEmail}
              className="px-3 py-1.5 rounded-lg border border-line bg-panel text-dim hover:text-amber hover:border-amber text-[12px] font-mono transition-colors cursor-pointer"
            >
              {copied ? dict.contact.copied : dict.contact.copyEmail}
            </button>
          </div>

          <Btn31 type="submit">{dict.contact.send}</Btn31>
        </div>

        {note && (
          <p className="font-mono text-[12px] text-amber mt-2 leading-relaxed" aria-live="polite">
            {note}
          </p>
        )}
      </form>
    </div>
  );
}
