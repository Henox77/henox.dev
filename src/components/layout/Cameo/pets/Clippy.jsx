import { useCallback, useEffect, useRef, useState } from 'react';
import { storageKey } from '../../../../config/site.js';
import { hasFinePointer, prefersReducedMotion } from '../../../../lib/env.js';
import { sessionGet, sessionSet } from '../../../../lib/storage.js';
import { pausableInterval } from '../../../../lib/timers.js';
import useTimer from '../../../../lib/useTimer.js';
import useScrollFx from '../shared/useScrollFx.js';
import { useLang } from '../../../../context/LangContext.jsx';
import './Clippy.css';

const KEY_HIDE = storageKey('clippy-hidden');
const KEY_HELLO = storageKey('clippy-hello');

const TIPS = {
  tr: {
    home: [
      'İpucu: Büyük başlıktaki bir harfi tutup fırlatabilirsin. Bir kere denedim, acıttı.',
      'Köşedeki meşale açık/koyu modu değiştirir. Tıklayıp deneyebilirsin.',
      'Henox odaklanmış modda. Yine de yeni projeler için iletişime geçebilirsin.',
    ],
    about: [
      'Burası hakkımda sayfası. Özetlerdim ama sadece bir ataşım.',
      'Geliştirici geçmişi ve teknoloji yığını burada listeleniyor.',
    ],
    projects: [
      'Projelere göz atıyorsun. Tüm repolar GitHub üzerinden canlı çekiliyor.',
      'Buradaki projeler Henox tarafından geliştirilmiş gerçek açık kaynak depolardır.',
    ],
    lab: [
      'Laboratuvar deneysel çalışmaların olduğu yerdir. Bazı parçalar kendi kendine hareket eder.',
      'Laboratuvarda bir yılan oyunu bile var.',
    ],
    any: [
      'Biliyor muydun? Ctrl+K tuşlarına basarak tema seçiciyi açabilirsin.',
      'Harika bir işletim sistemi zevkin var.',
      'Sitede gezindiğini görüyorum. Projeleri kurcalamaktan çekinme!',
    ],
  },
  en: {
    home: [
      'Pro tip: grab a letter in the big headline and throw it. I tried once. It hurt.',
      'The torch up in the corner switches light and dark. Yes, really. Click it.',
      'Henox is focused by default. Say hi anyway for projects.',
    ],
    about: [
      'This is the about page. I would summarise it, but I am only a paperclip.',
      'Looks like you are reading a developer journey. Keep exploring!',
    ],
    projects: [
      'Browsing projects? All cards are dynamically fetched via GitHub API.',
      'Every card here is an open source project built by Henox.',
    ],
    lab: [
      'The lab is where the experiments live. Some of them move on their own.',
      'There is a snake game in the lab. I am a snake, but bent in fewer places.',
    ],
    any: [
      'Did you know? Pressing Ctrl+K opens the skin picker.',
      'You have excellent taste in themes.',
      'Feel free to poke around and explore the projects!',
    ],
  },
};
const pageOf = (view, lang = 'tr') => {
  const dict = TIPS[lang] || TIPS.en;
  return String(view).startsWith('lab') ? 'lab' : dict[view] ? view : 'home';
};

const WIRE = 'M36 38V66.25A11.75 11.75 0 0 1 12.5 66.25V11.75A8.75 8.75 0 0 1 30 11.75V56.25A5.75 5.75 0 0 1 18.5 56.25V36';

export default function Clippy({ view, onNavigate }) {
  const { lang } = useLang();
  const [gone, setGone] = useState(() => sessionGet(KEY_HIDE) === '1');
  const [msg, setMsg] = useState(null);
  const [blink, setBlink] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const root = useRef(null);
  const tipIdx = useRef(0);
  const bubbleTimer = useTimer();
  const viewRef = useRef(view);
  const langRef = useRef(lang);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const close = useCallback(() => {
    bubbleTimer.clear();
    setMsg(null);
  }, [bubbleTimer]);

  const say = useCallback(
    (text, actions = [], ms = 9000) => {
      setMsg({ text, actions });
      setWiggle(true);
      setTimeout(() => setWiggle(false), 800);
      bubbleTimer.set(() => setMsg(null), actions.length > 1 ? 18000 : ms);
    },
    [bubbleTimer]
  );

  const nextTip = useCallback(() => {
    const curLang = langRef.current === 'tr' ? 'tr' : 'en';
    const dict = TIPS[curLang] || TIPS.en;
    const pool = [...dict[pageOf(viewRef.current, curLang)], ...dict.any];
    const text = pool[tipIdx.current++ % pool.length];
    say(text, [{ label: curLang === 'tr' ? 'Anladım' : 'Got it', run: close }]);
  }, [say, close]);

  const hide = () => {
    sessionSet(KEY_HIDE, '1');
    close();
    setGone(true);
  };

  useEffect(() => {
    if (gone || sessionGet(KEY_HELLO) === '1') return undefined;
    const id = setTimeout(() => {
      sessionSet(KEY_HELLO, '1');
      const isTr = lang === 'tr';
      say(
        isTr ? 'Bir portfolyo sitesini geziyorsun gibi görünüyor. Yardım ister misin?' : 'It looks like you are visiting a portfolio. Would you like help?',
        [
          { label: isTr ? 'Projeleri göster' : 'Show me the projects', run: () => { close(); onNavigate?.('projects'); } },
          { label: isTr ? 'Henox kimdir?' : 'Who is Henox?', run: () => { close(); onNavigate?.('about'); } },
          { label: isTr ? 'Ataşı gizle' : 'Hide Clippy', run: hide },
        ],
        20000
      );
    }, 1600);
    return () => clearTimeout(id);
  }, [gone, lang]);

  useEffect(() => {
    if (gone) return undefined;
    const stops = [
      pausableInterval(
        () => {
          setBlink(true);
          setTimeout(() => setBlink(false), 160);
        },
        () => 2800 + Math.random() * 3200
      ),
      pausableInterval(
        () => {
          if (!msg && Math.random() < 0.35) {
            setWiggle(true);
            setTimeout(() => setWiggle(false), 600);
          }
        },
        () => 9000 + Math.random() * 12000
      ),
    ];
    return () => stops.forEach((s) => s?.());
  }, [gone, msg]);

  useEffect(() => {
    if (gone) return undefined;
    const el = root.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return undefined;
    let t = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - t < 40) return;
      t = now;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 200));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 200));
      el.style.setProperty('--clippy-dx', `${dx * 1.5}px`);
      el.style.setProperty('--clippy-dy', `${dy * 1.5}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [gone]);

  const atBottom = useRef(false);
  useScrollFx(
    ({ progress }) => {
      if (progress > 0.96 && !atBottom.current && !msg) {
        atBottom.current = true;
        const isTr = langRef.current === 'tr';
        say(isTr ? 'Sayfanın en sonuna ulaştın! Yukarı çıkmak ister misin?' : 'You reached the end! Looking for a way back to the top?', [
          { label: isTr ? 'Beni yukarı çıkar' : 'Take me up', run: () => { close(); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
          { label: isTr ? 'Burada iyiyim' : 'No, I live here now', run: close },
        ]);
      } else if (progress < 0.9) atBottom.current = false;
    },
    { enabled: !gone }
  );

  if (gone) return null;

  const eye = (cx, cy, k) => (
    <g transform={`translate(${cx} ${cy}) scale(${k} ${blink ? 0.1 : k})`}>
      <ellipse rx="6.7" ry="5.7" fill="url(#clippy-rim)" stroke="#333366" strokeWidth="0.9" />
      <ellipse rx="5.2" ry="4.3" fill="url(#clippy-white)" stroke="#333366" strokeWidth="0.55" />
      <g transform="translate(0.9 0.5)">
        <g className="clippy-pupil">
          <ellipse rx="3.3" ry="3.3" fill="#0a0a12" />
          <ellipse cx="-1.05" cy="-1.1" rx="0.75" ry="0.65" fill="#fff" opacity="0.9" />
        </g>
      </g>
      <path d="M-5.1 -1.4A5.2 4.3 0 0 1 5.1 -1.4" fill="none" stroke="#333366" strokeWidth="0.8" opacity="0.35" />
    </g>
  );

  return (
    <div className="clippy" ref={root}>
      {msg && (
        <div className="clippy-bubble" role="status">
          <p>{msg.text}</p>
          {msg.actions.length > 0 && (
            <div className="clippy-actions">
              {msg.actions.map((a) => (
                <button key={a.label} type="button" onClick={a.run}>
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <button type="button" className={`clippy-body ${wiggle ? 'is-wiggle' : ''}`} onClick={nextTip} aria-label="Clippy" title="Clippy">
        <svg viewBox="0 0 42 81" width="40" height="77" aria-hidden="true">
          <defs>
            <radialGradient id="clippy-rim" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#d8d8f2" />
              <stop offset="0.55" stopColor="#9999cc" />
              <stop offset="1" stopColor="#666699" />
            </radialGradient>
            <radialGradient id="clippy-white" cx="0.4" cy="0.35" r="0.75">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#c9c9d6" />
            </radialGradient>
          </defs>
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={WIRE} stroke="#333366" strokeWidth="5" />
            <path d={WIRE} stroke="#666699" strokeWidth="3.9" />
            <path d={WIRE} stroke="#9999cc" strokeWidth="2.7" transform="translate(-0.2 -0.2)" />
            <path d={WIRE} stroke="#d6d6f0" strokeWidth="1.1" transform="translate(-0.75 -0.6)" opacity="0.9" />
          </g>
          {eye(11.5, 25, 0.95)}
          {eye(28.2, 29.2, 1.04)}
          <path className="clippy-brow" d="M7.5 17.5C9.5 14.8 13 13.2 17.2 13.8C14.4 16.7 10.5 17.9 7.5 17.5Z" fill="#0a0a12" />
          <path className="clippy-brow" d="M28.6 20.4C31.6 18.2 35.4 18.9 37.6 23.4C35.2 21.8 31.8 21.5 28.6 20.4Z" fill="#0a0a12" />
        </svg>
      </button>
    </div>
  );
}
