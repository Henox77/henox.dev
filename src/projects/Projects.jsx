import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import SectionHead from '../components/ui/SectionHead.jsx';
import { projects, arts, tags } from './index.js';
import { slugOf } from './slug.js';
import { SCROLL_MT_SUB, SECTION, WRAP } from '../config/ui.js';
import { labelOf } from '../config/pages.js';
import { storageKey } from '../config/site.js';
import { clamp } from '../lib/math.js';
import { BASE } from '../lib/paths.js';
import { sessionGet, sessionSet, storageGet, storageSet } from '../lib/storage.js';
import { canHover, prefersReducedMotion } from '../lib/env.js';
import { isSlashShortcut } from '../lib/dom.js';
import { useLang } from '../context/LangContext.jsx';
import './Projects.css';

const MODE_KEY = storageKey('projects-mode');
const SEEN_KEY = storageKey('projects-seen');
const LS_DEFAULT_MIN = 12;

const extOf = (p) => p.file.slice(p.file.lastIndexOf('.'));
const repoPathOf = (p) => new URL(p.href).pathname.replace(/^\//, '');
const checkPages = async (p, signal) => {
  const repo = repoPathOf(p);
  const key = `pages:${repo}`;
  const hit = sessionGet(key);
  if (hit) return hit;
  const r = await fetch(`https://api.github.com/repos/${repo}`, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (r.status !== 404 && !r.ok) return 'unknown';
  const v = r.status !== 404 && (await r.json()).has_pages ? 'live' : 'off';
  sessionSet(key, v);
  return v;
};
const DEPLOY = {
  live: { led: 'on', title: 'live on GitHub Pages', label: 'Deployed' },
  off: { led: 'off', title: 'not deployed', label: 'Not deployed' },
  unknown: { led: 'idle', title: 'checking…', label: 'Checking deployment' },
};
const DEPLOY_CHECKING = { led: 'check', title: 'checking…', label: 'Checking deployment' };
const camel = (s) => s.replace(/[^a-z0-9]+(.)?/gi, (_, c) => (c ? c.toUpperCase() : ''));

function Star({ className }) {
  return (
    <svg viewBox="0 0 5 5" className={className} aria-hidden="true">
      <path d="M2 0h1v1H2zM2 1h1v1H2zM0 2h5v1H0zM1 3h3v1H1zM1 4h1v1H1zM3 4h1v1H3z" />
    </svg>
  );
}

const ArrowIcon = () => (
  <svg viewBox="0 0 4 7" aria-hidden="true">
    <path d="M0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM2 4h1v1H2zM1 5h1v1H1zM0 6h1v1H0z" />
  </svg>
);

function Readout({ p }) {
  const { lang } = useLang();
  const desc = lang === 'tr' && p.descTr ? p.descTr : p.desc;
  const rows = [...(p.facts ?? []), ['repo', repoPathOf(p)]];
  const line = (i) => ({ '--i': i });
  return (
    <div className="proj-code" role="group" aria-label={`Details of ${p.file}`}>
      <p className="c" style={line(0)}>{desc}</p>
      <p style={line(1)}>
        <span className="k">const</span> <span className="n">{camel(slugOf(p))}</span> {'= {'}
      </p>
      {rows.map(([label, value], i) => (
        <p key={label} className="i" style={line(i + 2)}>
          <span className="n">{camel(label)}</span>: <span className="s">{`'${value}'`}</span>,
        </p>
      ))}
      <p style={line(rows.length + 2)}>{'};'}</p>
    </div>
  );
}

function stageMove(e) {
  if (!canHover() || prefersReducedMotion()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  el.style.setProperty('--mx', `${x}px`);
  el.style.setProperty('--my', `${y}px`);
  el.style.setProperty('--px', ((x / r.width) * 2 - 1).toFixed(3));
  el.style.setProperty('--py', ((y / r.height) * 2 - 1).toFixed(3));
}
function stageLeave(e) {
  e.currentTarget.style.setProperty('--px', '0');
  e.currentTarget.style.setProperty('--py', '0');
}

export default function Projects() {
  const { dict, lang } = useLang();
  const [picked, setPicked] = useState(() => location.hash.slice(1));
  const [shotFor, setShotFor] = useState(null);
  const [brokenShots, setBrokenShots] = useState({});
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [status, setStatus] = useState({});
  const [mode, setModeState] = useState(() => {
    const saved = storageGet(MODE_KEY);
    return saved === 'shelf' || saved === 'ls' ? saved : projects.length > LS_DEFAULT_MIN ? 'ls' : 'shelf';
  });
  const setMode = (m) => {
    setModeState(m);
    storageSet(MODE_KEY, m);
  };
  const [seen, setSeen] = useState(() => {
    try {
      const v = JSON.parse(storageGet(SEEN_KEY) ?? '[]');
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  });
  const seenSet = useMemo(() => new Set(seen), [seen]);
  const lsRef = useRef(null);
  const filterRef = useRef(null);
  const tabs = useRef({});
  const rail = useRef(null);
  const consoleRef = useRef(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return projects.filter(
      (x) =>
        (!tag || x.tags?.includes(tag)) &&
        (!s || [x.file, x.desc, ...(x.tags ?? [])].join(' ').toLowerCase().includes(s)),
    );
  }, [q, tag]);

  const p = list.find((x) => slugOf(x) === picked) ?? list[0] ?? projects[0];
  const slug = p ? slugOf(p) : '';
  const at = list.findIndex((x) => slugOf(x) === slug);
  const Art = arts[slug];
  const st = status[slug];
  const dep = DEPLOY[st] ?? DEPLOY_CHECKING;
  const hasShot = Boolean(p?.shot) && !brokenShots[slug];
  const showShot = hasShot && shotFor === slug;

  useEffect(() => {
    if (!slug) return;
    history.replaceState(history.state, '', `#${slug}`);
    const el = tabs.current[slug];
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
    if (mode === 'ls') {
      const c = lsRef.current;
      if (c && el) {
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        const view = c.scrollTop + c.clientHeight;
        if (bottom < c.scrollTop || top > view) {
          c.scrollTo({ top: top - (c.clientHeight - el.offsetHeight) / 2, behavior });
        } else if (top < c.scrollTop) c.scrollTo({ top, behavior });
        else if (bottom > view) c.scrollTo({ top: bottom - c.clientHeight, behavior });
      }
      return;
    }
    const c = rail.current;
    if (c && el) c.scrollTo({ left: el.offsetLeft - (c.clientWidth - el.offsetWidth) / 2, behavior });
  }, [slug, mode]);

  useEffect(() => {
    if (slug && picked === slug) setSeen((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, [slug, picked]);
  useEffect(() => {
    storageSet(SEEN_KEY, JSON.stringify(seen));
  }, [seen]);

  useEffect(() => {
    let stale = false;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 6000);
    projects.forEach((x) => {
      const k = slugOf(x);
      const done = (v) => !stale && setStatus((s) => ({ ...s, [k]: v }));
      checkPages(x, ctl.signal)
        .then(done)
        .catch(() => done('unknown'));
    });
    return () => {
      stale = true;
      clearTimeout(timer);
      ctl.abort();
    };
  }, []);

  const move = (e, i) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      window.open(list[i].href, '_blank', 'noopener,noreferrer');
      return;
    }
    const last = list.length - 1;
    const to = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: last,
    }[e.key];
    if (to == null) return;
    e.preventDefault();
    const arrow = e.key.startsWith('Arrow');
    if (arrow && e.repeat && (to < 0 || to > last)) return;
    const next = list[arrow ? (to + list.length) % list.length : clamp(to, 0, last)];
    setPicked(slugOf(next));
    tabs.current[slugOf(next)]?.focus({ preventScroll: true });
  };
  const sectionKey = (e) => {
    if (!isSlashShortcut(e)) return;
    e.preventDefault();
    filterRef.current?.focus();
  };
  const filterKey = (e) => {
    if (e.nativeEvent.isComposing) return;
    const focusPicked = () => tabs.current[slug]?.focus({ preventScroll: true });
    if (e.key === 'ArrowDown' || (e.key === 'Enter' && list.length)) {
      e.preventDefault();
      focusPicked();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (q) setQ('');
      else focusPicked();
    }
  };
  const resetFilters = () => {
    setQ('');
    setTag('');
  };
  const pick = (k) => {
    setPicked(k);
    const el = consoleRef.current;
    const navH = document.querySelector('#root > nav')?.offsetHeight ?? 0;
    if (el && el.getBoundingClientRect().top < navH) {
      el.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };
  const nudge = (d) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: 'smooth' });

  if (!p) {
    return (
      <section id="projects" className={SECTION}>
        <div className={WRAP}>
          <SectionHead num="01" title={labelOf('projects')} level={1} />
          <p className="proj-empty">{'nothing here yet'}</p>
        </div>
      </section>
    );
  }

  const played = projects.filter((x) => seenSet.has(slugOf(x))).length;
  const cleared = played === projects.length;

  const thumbs = list.some((x) => x.shot && !brokenShots[slugOf(x)]);

  const cart = (x, i) => {
    const k = slugOf(x);
    const common = {
      ref: (el) => {
        tabs.current[k] = el;
      },
      type: 'button',
      role: 'tab',
      id: `proj-tab-${k}`,
      'aria-label': x.file,
      'aria-selected': k === slug,
      'aria-controls': 'proj-panel',
      tabIndex: k === slug ? 0 : -1,
      style: { '--c': x.color },
      'data-off': status[k] === 'off' || undefined,
      'data-seen': (k !== slug && seenSet.has(k)) || undefined,
      onClick: () => pick(k),
      onKeyDown: (e) => move(e, i),
    };
    return mode === 'ls' ? (
      <button key={k} {...common} className="proj-row">
        <span className="proj-row-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        {thumbs && (
          <span className="proj-row-thumb" aria-hidden="true">
            {x.shot && !brokenShots[k] && (
              <img
                src={`${BASE}previews/${k}.png`}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setBrokenShots((b) => ({ ...b, [k]: true }))}
              />
            )}
          </span>
        )}
        <span className="proj-row-f">{x.file}</span>
        <span className="proj-row-d">{x.desc}</span>
        <span className="proj-row-t" aria-hidden="true">
          {seenSet.has(k) && <Star className="proj-row-star" />}
          {x.tags?.join(' ')}
        </span>
      </button>
    ) : (
      <button key={k} {...common} className="proj-cart">
        <span className="proj-cart-grip" aria-hidden="true" />
        <span className="proj-cart-label" aria-hidden="true">
          <span className="proj-cart-ext">{extOf(x)}</span>
          <span className="proj-cart-name">{k}</span>
        </span>
        <span className="proj-cart-pins" aria-hidden="true" />
      </button>
    );
  };

  return (
    <section id="projects" className={SECTION} onKeyDown={sectionKey}>
      <div className={WRAP}>
        <SectionHead num="01" title={labelOf('projects')} level={1} />
        <p className="-mt-6 mb-8 text-dim text-[14px] max-w-[60ch]">
          {dict.projects.subtitle}
        </p>

        <div id="proj-panel" ref={consoleRef} role="tabpanel" aria-labelledby={`proj-tab-${slug}`} className={`proj-console ${SCROLL_MT_SUB}`}>
          <div key={slug} className="proj-console-body">
            <div className="proj-screen">
              <div className="proj-art" data-off={st === 'off' || undefined} style={{ color: p.color }} onPointerMove={stageMove} onPointerLeave={stageLeave}>
                {st === 'off' && (
                  <div className="proj-static" aria-hidden="true">
                    <span>NO SIGNAL</span>
                  </div>
                )}
                <div className="proj-crt">
                  {showShot ? (
                    <img
                      src={`${BASE}previews/${slug}.png`}
                      alt={`Screenshot of ${p.file}`}
                      className="proj-shot"
                      onError={() => setBrokenShots((b) => ({ ...b, [slug]: true }))}
                    />
                  ) : (
                    <>
                      <span className="proj-ghost" style={{ '--n': slug.length }} aria-hidden="true">
                        {slug}
                      </span>
                      {Art && (
                        <div className="proj-art-inner" aria-hidden="true">
                          <Suspense fallback={null}><Art /></Suspense>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="proj-info">
              <div className="flex items-center justify-between gap-3 min-h-8">
                <span className="flex items-center gap-2.5 font-mono text-[13px] text-ink min-w-0">
                  <span
                    className="proj-led"
                    data-state={dep.led}
                    title={dep.title}
                    role="img"
                    aria-label={dep.label}
                  />
                  <span className="truncate">{p.file}</span>
                </span>
                {hasShot && (
                  <span className="proj-switch" role="group" aria-label="Preview type">
                    <button type="button" aria-pressed={!showShot} onClick={() => setShotFor(null)}>
                      art
                    </button>
                    <button type="button" aria-pressed={showShot} onClick={() => setShotFor(slug)}>
                      screenshot
                    </button>
                  </span>
                )}
              </div>
              <Readout p={p} />
              <a href={p.href} target="_blank" rel="noreferrer" className="proj-open">
                {lang === 'tr' ? 'GitHub üzerinde aç' : 'Open on GitHub'}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="proj-bar">
          <label className="proj-prompt">
            <span aria-hidden="true">$ ls projects/ | grep</span>
            <input
              type="text"
              ref={filterRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={filterKey}
              placeholder="…"
              aria-label="Filter projects"
              spellCheck={false}
              autoComplete="off"
            />
            {q && (
              <button
                type="button"
                className="proj-clear"
                aria-label="Clear filter"
                onClick={() => {
                  setQ('');
                  filterRef.current?.focus();
                }}
              >
                ×
              </button>
            )}
          </label>
          <span className="proj-count" aria-live="polite">
            {String(at + 1).padStart(2, '0')}
            <i>/{String(list.length).padStart(2, '0')}</i>
          </span>
          {projects.length > 1 && (
            <span className="proj-switch" role="group" aria-label="Layout">
              <button type="button" aria-pressed={mode === 'shelf'} onClick={() => setMode('shelf')}>shelf</button>
              <button type="button" aria-pressed={mode === 'ls'} onClick={() => setMode('ls')}>ls</button>
            </span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="proj-tags" role="group" aria-label="Filter by tag">
            {['', ...tags].map((t) => (
              <button key={t || 'all'} type="button" aria-pressed={tag === t} onClick={() => setTag(tag === t ? '' : t)}>
                {t ? `--${t}` : '--all'}
              </button>
            ))}
          </div>
        )}

        {list.length === 0 ? (
          <p className="proj-empty">
            grep: no match.{' '}
            <button type="button" className="proj-reset" onClick={resetFilters}>
              clear filters
            </button>
          </p>
        ) : mode === 'ls' ? (
          <>
            <div className="proj-played" data-clear={cleared || undefined}>
              <Star className="proj-played-star" />
              <span className="proj-played-n">
                {String(played).padStart(2, '0')}
                <i>/{String(projects.length).padStart(2, '0')}</i>
              </span>
              <span className="proj-played-label">{cleared ? 'all cartridges cleared' : 'cartridges played'}</span>
              <span
                className="proj-played-bar"
                style={{ '--p': played / projects.length }}
                aria-hidden="true"
              />
            </div>
            <div ref={lsRef} role="tablist" aria-label="Project list" className="proj-ls scroll-thin" data-thumbs={thumbs || undefined}>
              {list.map(cart)}
            </div>
          </>
        ) : (
          <div className="proj-shelf">
            <button type="button" className="proj-nudge l" onClick={() => nudge(-1)} aria-label="Scroll left">
              <ArrowIcon />
            </button>
            <div ref={rail} role="tablist" aria-label="Project cartridges" className="proj-cartridges scroll-hidden">
              {list.map(cart)}
            </div>
            <button type="button" className="proj-nudge r" onClick={() => nudge(1)} aria-label="Scroll right">
              <ArrowIcon />
            </button>
            <div className="proj-board" aria-hidden="true" />
          </div>
        )}
        <p className="proj-hint">
          {mode === 'ls' ? (
            <>
              <kbd>↑</kbd> <kbd>↓</kbd> browse · <kbd>↵</kbd> open repo · <kbd>/</kbd> filter
            </>
          ) : (
            <>
              <kbd>←</kbd> <kbd>→</kbd> to swap cartridges
            </>
          )}
        </p>
      </div>
    </section>
  );
}