import { useEffect, useMemo, useRef, useState } from 'react';
import SectionHead from '../components/ui/SectionHead.jsx';
import { useGithubRepos } from '../lib/github.js';
import { slugOf } from './slug.js';
import { SCROLL_MT_SUB, SECTION, WRAP } from '../config/ui.js';
import { labelOf } from '../config/pages.js';
import { site, storageKey } from '../config/site.js';
import { clamp } from '../lib/math.js';
import { storageGet, storageSet } from '../lib/storage.js';
import { canHover, prefersReducedMotion } from '../lib/env.js';
import { isSlashShortcut } from '../lib/dom.js';
import { useLang } from '../context/LangContext.jsx';
import './Projects.css';

const MODE_KEY = storageKey('projects-mode');
const SEEN_KEY = storageKey('projects-seen');
const LS_DEFAULT_MIN = 12;

const extOf = (p) => {
  if (p.language) {
    const l = p.language.toUpperCase();
    if (l === 'TYPESCRIPT') return 'TS';
    if (l === 'JAVASCRIPT') return 'JS';
    if (l === 'PYTHON') return 'PY';
    return l.slice(0, 4);
  }
  return 'GIT';
};

const camel = (s) => (s || '').replace(/[^a-z0-9]+(.)?/gi, (_, c) => (c ? c.toUpperCase() : ''));

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
  const rows = [...(p.facts ?? []), ['repo', `${site.githubUser}/${p.name}`]];
  const line = (i) => ({ '--i': i });
  return (
    <div className="proj-code" role="group" aria-label={`Details of ${p.name}`}>
      <p className="c" style={line(0)}>{desc}</p>
      <p style={line(1)}>
        <span className="k">const</span> <span className="n">{camel(p.name)}</span> {'= {'}
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
  const { repos } = useGithubRepos();
  const [picked, setPicked] = useState(() => location.hash.slice(1));
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [copied, setCopied] = useState(false);

  const [mode, setModeState] = useState(() => {
    const saved = storageGet(MODE_KEY);
    return saved === 'shelf' || saved === 'ls' ? saved : repos.length > LS_DEFAULT_MIN ? 'ls' : 'shelf';
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

  const tags = useMemo(() => {
    return [...new Set(repos.flatMap((p) => p.tags ?? []))].sort();
  }, [repos]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return repos.filter((x) =>
      (!tag || x.tags?.includes(tag) || x.language?.toLowerCase() === tag) &&
      (!s || [x.name, x.desc, x.descTr, ...(x.tags ?? [])].join(' ').toLowerCase().includes(s))
    );
  }, [repos, q, tag]);

  const p = list.find((x) => slugOf(x) === picked) ?? list[0] ?? repos[0];
  const slug = p ? slugOf(p) : '';
  const at = list.findIndex((x) => slugOf(x) === slug);

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
    if (to === undefined) return;
    e.preventDefault();
    const next = clamp(to, 0, last);
    const nextSlug = slugOf(list[next]);
    setPicked(nextSlug);
    tabs.current[nextSlug]?.focus();
  };

  const pick = (s) => {
    setPicked(s);
  };

  const nudge = (dir) => {
    if (at === -1) return;
    const next = clamp(at + dir, 0, list.length - 1);
    const nextSlug = slugOf(list[next]);
    pick(nextSlug);
    tabs.current[nextSlug]?.focus();
  };

  const resetFilters = () => {
    setQ('');
    setTag('');
    filterRef.current?.focus();
  };

  const filterKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setQ('');
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!list.length) return;
      const first = slugOf(list[0]);
      setPicked(first);
      tabs.current[first]?.focus();
    }
  };

  const sectionKey = (e) => {
    if (isSlashShortcut(e)) {
      e.preventDefault();
      filterRef.current?.focus();
      filterRef.current?.select();
    }
  };

  const copyCloneCmd = () => {
    if (!p) return;
    navigator.clipboard.writeText(`git clone ${p.href}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const played = repos.filter((x) => seenSet.has(slugOf(x))).length;
  const cleared = played === repos.length && repos.length > 0;

  const cart = (x, i) => {
    const k = slugOf(x);
    const common = {
      ref: (el) => {
        tabs.current[k] = el;
      },
      type: 'button',
      role: 'tab',
      id: `proj-tab-${k}`,
      'aria-label': x.name,
      'aria-selected': k === slug,
      'aria-controls': 'proj-panel',
      tabIndex: k === slug ? 0 : -1,
      style: { '--c': x.color },
      'data-seen': (k !== slug && seenSet.has(k)) || undefined,
      onClick: () => pick(k),
      onKeyDown: (e) => move(e, i),
    };
    return mode === 'ls' ? (
      <button key={k} {...common} className="proj-row">
        <span className="proj-row-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <span className="proj-row-f font-bold">{x.name}</span>
        <span className="proj-row-d">{lang === 'tr' && x.descTr ? x.descTr : x.desc}</span>
        <span className="proj-row-t" aria-hidden="true">
          {x.stars > 0 && <span className="text-amber mr-2">★ {x.stars}</span>}
          <span>{x.language}</span>
        </span>
      </button>
    ) : (
      <button key={k} {...common} className="proj-cart">
        <span className="proj-cart-grip" aria-hidden="true" />
        <span className="proj-cart-label" aria-hidden="true">
          <span className="proj-cart-ext">{extOf(x)}</span>
          <span className="proj-cart-name">{x.name}</span>
        </span>
        <span className="proj-cart-pins" aria-hidden="true" />
      </button>
    );
  };

  return (
    <section id="projects" className={SECTION} onKeyDown={sectionKey}>
      <div className={WRAP}>
        <SectionHead num="01" title={labelOf('projects')} level={1} />
        <div className="flex items-center justify-between -mt-6 mb-8 gap-4 flex-wrap">
          <p className="text-dim text-[14px] max-w-[60ch]">
            {dict.projects.subtitle}
          </p>
          <a
            href={`https://github.com/${site.githubUser}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="text-amber font-mono text-xs flex items-center gap-1.5 hover:underline"
          >
            <span>{lang === 'tr' ? 'GitHub Profili' : 'GitHub Profile'} ({site.githubUser})</span> →
          </a>
        </div>

        {p && (
          <div id="proj-panel" ref={consoleRef} role="tabpanel" aria-labelledby={`proj-tab-${slug}`} className={`proj-console ${SCROLL_MT_SUB}`}>
            <div key={slug} className="proj-console-body">
              <div className="proj-screen">
                <div className="proj-art" style={{ color: p.color }} onPointerMove={stageMove} onPointerLeave={stageLeave}>
                  <div className="proj-crt p-5 sm:p-7 flex flex-col justify-between h-full bg-panel/95">
                    <div className="flex items-center justify-between pb-3 border-b border-line">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        <span className="ml-2 font-mono text-xs text-dim">$ gh repo view {site.githubUser}/{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.stars > 0 && (
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber/10 border border-amber/30 text-amber flex items-center gap-1">
                            ★ {p.stars}
                          </span>
                        )}
                        <span className="font-mono text-xs px-2 py-0.5 rounded border border-line text-dim">{lang === 'tr' ? 'açık kaynak' : 'public'}</span>
                      </div>
                    </div>

                    <div className="my-auto py-3">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-amber flex-none" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                        </svg>
                        <h3 className="font-mono text-xl sm:text-2xl font-bold text-ink">
                          {p.name}
                        </h3>
                      </div>

                      <p className="text-dim text-sm sm:text-base leading-relaxed font-sans max-w-xl">
                        {lang === 'tr' && p.descTr ? p.descTr : p.desc}
                      </p>

                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.tags.slice(0, 6).map((t) => (
                            <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-line/40 text-dim">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 p-2.5 rounded bg-black/40 border border-line font-mono text-xs text-amber flex items-center justify-between">
                        <code>$ git clone {p.href}.git</code>
                        <button
                          type="button"
                          onClick={copyCloneCmd}
                          className="text-[11px] text-dim hover:text-amber transition-colors px-1.5 py-0.5 rounded border border-line"
                        >
                          {copied ? (lang === 'tr' ? 'kopyalandı!' : 'copied!') : (lang === 'tr' ? 'kopyala' : 'copy')}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-line font-mono text-xs">
                      <div className="flex items-center gap-3">
                        {p.language && (
                          <span className="flex items-center gap-1.5 text-ink">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                            {p.language}
                          </span>
                        )}
                        {p.forks > 0 && (
                          <span className="text-dim">⑂ {p.forks}</span>
                        )}
                      </div>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber hover:underline flex items-center gap-1 font-mono text-xs"
                      >
                        {lang === 'tr' ? 'GitHub’da Aç' : 'Open on GitHub'} ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="proj-info">
                <div className="flex items-center justify-between gap-3 min-h-8">
                  <span className="flex items-center gap-2.5 font-mono text-[13px] text-ink min-w-0">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="truncate">{site.githubUser}/{p.name}</span>
                  </span>
                  {p.homepage && (
                    <a
                      href={p.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-amber hover:underline"
                    >
                      {lang === 'tr' ? 'Canlı Demo ↗' : 'Live Demo ↗'}
                    </a>
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
        )}

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
          {repos.length > 1 && (
            <span className="proj-switch" role="group" aria-label="Layout">
              <button type="button" aria-pressed={mode === 'shelf'} onClick={() => setMode('shelf')}>{dict.projects.shelfView || 'shelf'}</button>
              <button type="button" aria-pressed={mode === 'ls'} onClick={() => setMode('ls')}>{dict.projects.listView || 'ls'}</button>
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
              {lang === 'tr' ? 'filtreleri temizle' : 'clear filters'}
            </button>
          </p>
        ) : mode === 'ls' ? (
          <>
            <div className="proj-played" data-clear={cleared || undefined}>
              <Star className="proj-played-star" />
              <span className="proj-played-n">
                {String(played).padStart(2, '0')}
                <i>/{String(repos.length).padStart(2, '0')}</i>
              </span>
              <span className="proj-played-label">{cleared ? (lang === 'tr' ? 'tüm repolar incelendi' : 'all repositories explored') : (lang === 'tr' ? 'repo incelendi' : 'repositories explored')}</span>
              <span
                className="proj-played-bar"
                style={{ '--p': repos.length ? played / repos.length : 0 }}
                aria-hidden="true"
              />
            </div>
            <div ref={lsRef} role="tablist" aria-label="Project list" className="proj-ls scroll-thin">
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
              <kbd>←</kbd> <kbd>→</kbd> to swap projects
            </>
          )}
        </p>
      </div>
    </section>
  );
}
