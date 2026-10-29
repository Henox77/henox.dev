import { useEffect, useRef, useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { gitLog, stack, skillGroups, learningSkills, startYear, mainStack, learning } from '../../data/profile.js';
import { site } from '../../config/site.js';
import { useStatus } from '../../lib/status.js';
import { useNap } from '../../lib/nap.js';
import { has, prefersReducedMotion } from '../../lib/env.js';
import { observeOnce } from '../../lib/observe.js';
import { useAsleep } from '../../lib/social.js';
import { useLang } from '../../context/LangContext.jsx';
import './About.css';
import { SCROLL_MT_SUB, SECTION, WRAP } from '../../config/ui.js';
import { labelOf } from '../../config/pages.js';

const TYPES = {
  init: 'var(--text)',
  feat: 'var(--green)',
  fix: 'var(--danger)',
  chore: 'var(--text-dim)',
  refactor: 'var(--css-lang)',
  revert: 'var(--amber)',
  wip: 'var(--amber)',
};

const parseMsg = (msg) => {
  const type = msg.slice(0, Math.max(0, msg.indexOf(':')));
  return has(TYPES, type) ? [type, msg.slice(type.length + 1).trim()] : ['', msg];
};

const LEARNING = new Set(learningSkills);
const MIN_SLEEP_MS = 3000;
const SKILLS = (() => {
  const grouped = new Set(skillGroups.flatMap(([, items]) => items));
  return [...skillGroups, ['other', stack.filter((s) => !grouped.has(s))]]
    .map(([name, items]) => [name, items.filter((s) => stack.includes(s))])
    .filter(([, items]) => items.length);
})();

function HelloLine({ sleeping, why, lang }) {
  const [word, setWord] = useState('hello');
  const [note, setNote] = useState('');
  const cur = useRef('hello');
  const lastWhy = useRef(why);
  const sleptAt = useRef(0);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    let dead = false;
    let timer = 0;
    const wait = (ms) =>
      new Promise((r) => {
        timer = window.setTimeout(r, reduce ? 0 : ms);
      });
    const show = (w) => {
      cur.current = w;
      setWord(w);
    };
    const retype = async (target) => {
      while (cur.current) {
        await wait(60);
        if (dead) return false;
        show(cur.current.slice(0, -1));
      }
      for (const ch of target) {
        await wait(90);
        if (dead) return false;
        show(cur.current + ch);
      }
      return true;
    };
    (async () => {
      if (sleeping) {
        lastWhy.current = why;
        sleptAt.current ||= performance.now();
        setNote('');
        if (cur.current !== 'sleep' && !(await retype('sleep'))) return;
        setNote(why === 'battery' ? ' zzz... social battery: 0%' : ' zzz...');
        return;
      }
      if (cur.current !== 'hello') {
        await wait(MIN_SLEEP_MS - (performance.now() - sleptAt.current));
        if (dead) return;
        sleptAt.current = 0;
        setNote('');
        if (!(await retype('hello'))) return;
        const isTr = lang === 'tr';
        setNote(
          lastWhy.current === 'battery'
            ? isTr
              ? ' selam! bataryam şarj oldu'
              : ' oh. hi. battery recharged'
            : isTr
            ? ' selam! gözlerimi dinlendiriyordum'
            : ' oh. hi. i was just resting my eyes'
        );
      }
      await wait(3000);
      if (!dead) setNote('');
    })();
    return () => {
      dead = true;
      clearTimeout(timer);
    };
  }, [sleeping, why, lang]);

  return (
    <span className="ab-line">
      {site.id}.<span className="ab-fn">{word}</span>()
      {note && <span className="ab-cm">{note}</span>}
      <span className="ab-caret" aria-hidden="true" />
    </span>
  );
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    return observeOnce(ref.current.querySelectorAll('.ab-rev'), (el) => el.classList.add('is-in'), 0.12);
  }, []);
  return ref;
}

function Win({ title, lang, foot, children }) {
  return (
    <div className="ab-win ab-rev">
      <div className="ab-bar">
        <span className="ab-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ab-title">{title}</span>
        <span className="ab-lang">{lang}</span>
      </div>
      {children}
      {foot && <div className="ab-foot">{foot}</div>}
    </div>
  );
}

function CodeWindow() {
  const status = useStatus();
  const nap = useNap();
  const tired = useAsleep();
  const sleeping = nap === 'nap' || tired;
  const { dict, lang } = useLang();

  const facts = [
    ['role', site.role],
    ['based_in', `${site.location}, ${site.country}`],
    ['started_coding', startYear],
    ['favorite_stack', mainStack],
    ['currently_learning', learning],
    ['fun_fact', dict.about.funFact],
    ['coffee_or_tea', dict.about.coffeeOrTea],
  ];

  return (
    <Win
      title="about.js"
      lang="JavaScript"
      foot={
        <>
          <span>Ln {facts.length + 5}, Col 1</span>
          <span>UTF-8</span>
          <span>Spaces: 2</span>
        </>
      }
    >
      <pre className={`ab-code${sleeping ? ' is-asleep' : ''}`}>
        <span className="ab-line">
          <b className="ab-kw">const</b> {site.id} = {'{'}
        </span>
        {facts.map(([k, v]) => (
          <span key={k} className="ab-line ab-ind">
            {k}:{' '}
            {typeof v === 'number' ? <span className="ab-num">{v}</span> : <span className="ab-str">"{v}"</span>},
          </span>
        ))}
        <span className="ab-line ab-ind">
          status: <span style={{ color: status.color }}>"{status.key}"</span>,
          <span className={`ab-live${status.pulse ? ' is-pulse' : ''}`} style={{ '--c': status.color }} aria-hidden="true" />
        </span>
        <span className="ab-line">{'};'}</span>
        <HelloLine sleeping={sleeping} why={nap === 'nap' ? 'idle' : 'battery'} lang={lang} />
      </pre>
    </Win>
  );
}

const Label = ({ children }) => (
  <h3 className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-dim mb-4">{children}</h3>
);

export default function About() {
  const root = useReveal();
  const { dict, lang } = useLang();
  const years = new Date().getFullYear() - startYear;
  const stats = [
    [years, dict.about.yearsCoding],
    [gitLog.length, dict.about.commitsLife],
    [stack.length, dict.about.toolsStack],
  ];

  return (
    <section id="about" ref={root} className={SECTION}>
      <div className={WRAP}>
        <SectionHead num="01" title={labelOf('about')} level={1} />
        <p className="font-mono text-[12.5px] text-dim -mt-6 mb-10">{dict.about.subtitle}</p>

        <div id="about-intro" className={`mb-14 ${SCROLL_MT_SUB} grid gap-5 lg:grid-cols-[1.35fr_1fr] items-start`}>
          <CodeWindow />

          <div className="flex flex-col gap-5 min-w-0">
            <div className="ab-card ab-rev">
              <div className="ab-k">{dict.about.readmeTitle}</div>
              <p className="text-[15px] leading-[1.75] text-ink">
                {dict.about.readmeContent}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map(([n, label], i) => (
                <div key={label} className="ab-rev" style={{ '--i': i + 1 }}>
                  <div className="ab-stat">
                    <b>{n}</b>
                    <span>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="about-journey" className={`mb-14 ${SCROLL_MT_SUB}`}>
          <Label>{dict.about.logTitle}</Label>
          <Win title="log.sh" lang="bash">
            <div className="ab-term">
              <div className="text-dim mb-5">$ git log --graph --oneline --reverse life</div>
              <ol className="ab-tl">
                {gitLog.map((e, i) => {
                  const rawMsg = lang === 'tr' ? (e.msgTr || e.msg) : (e.msgEn || e.msg);
                  const [type, text] = parseMsg(rawMsg);
                  return (
                    <li
                      key={e.hash}
                      className={`ab-rev${e.date === 'now' ? ' is-now' : ''}`}
                      style={{ '--i': i, '--c': TYPES[type] ?? 'var(--text-dim)' }}
                    >
                      <span className="ab-dot" aria-hidden="true" />
                      <div className="ab-meta">
                        <span className="ab-hash">{e.hash}</span>
                        <span className="ab-date">{e.date}</span>
                        {type && <span className="ab-badge">{type}</span>}
                        {e.date === 'now' && <span className="ab-head">HEAD → main</span>}
                      </div>
                      <p className="ab-msg">{text}</p>
                    </li>
                  );
                })}
              </ol>
              <div className="text-dim mt-5">
                $ <span className="ab-caret" aria-hidden="true" />
              </div>
            </div>
          </Win>
        </div>

        <div id="about-skills" className={SCROLL_MT_SUB}>
          <Label>{dict.about.skillsTitle}</Label>
          <Win title="skills.js" lang="JavaScript">
            <div className="ab-skills">
              {SKILLS.map(([name, items]) => (
                <div key={name}>
                  <div className="ab-k">{name}</div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span key={s} className="ab-chip">
                        {s}
                        {LEARNING.has(s) && <em>{lang === 'tr' ? 'öğreniyor' : 'learning'}</em>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Win>
        </div>
      </div>
    </section>
  );
}
