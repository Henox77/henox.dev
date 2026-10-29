import { Suspense, useState } from 'react';
import '../../projects/Projects.css';
import '../lab/Lab/LabFx.css';
import './Chips.css';
import LabIcon from '../lab/Lab/LabIcon.jsx';
import { TECH_COLORS } from '../../config/tech.js';
import TechIcon from '../ui/TechIcon.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import Terminal from './Terminal/Terminal.jsx';
import { featured } from '../../projects/index.js';
import { useGithubRepos } from '../../lib/github.js';
import { LAB_ITEMS } from '../../config/lab-items.js';
import { gitLog, stack } from '../../data/profile.js';
import { site } from '../../config/site.js';
import PageLink from '../ui/PageLink.jsx';
import { spotMove } from '../../lib/dom.js';
import useSkin from '../../lib/useSkin.js';
import { canHover, prefersReducedMotion } from '../../lib/env.js';
import useTimer from '../../lib/useTimer.js';
import { SECTION_ANCHOR, WRAP } from '../../config/ui.js';
import { labelOf } from '../../config/pages.js';
import { useLang } from '../../context/LangContext.jsx';
import HlArrow from '../ui/HlArrow.jsx';
import Scramble from '../ui/Scramble.jsx';

export function FeaturedProjects({ onNavigate }) {
  const { featured: githubFeatured } = useGithubRepos();
  const list = githubFeatured && githubFeatured.length ? githubFeatured : featured;
  const [i, setI] = useState(0);
  const hoverT = useTimer();
  const scrollT = useTimer();
  const { dict, lang } = useLang();
  const p = list[i];
  const hoverable = canHover();
  const pick = (n) => hoverT.set(() => setI(n), 80);

  if (!p) return null;

  return (
    <section id="featured" className={SECTION_ANCHOR}>
      <div className={WRAP}>
        <SectionHead num="01" title={labelOf('projects')} />
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 md:gap-12 items-start">
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${p.name || p.file}`}
            onMouseMove={spotMove}
            className="spot relative block min-h-[300px] p-6 rounded-[12px] overflow-hidden bg-panel border border-line flex flex-col justify-between group transition-all duration-300 hover:border-amber/50"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-xs text-dim">github.com/{site.githubUser}/{p.name || p.file}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-line text-dim">public</span>
            </div>

            <div className="py-4 my-auto">
              <div className="flex items-center gap-2.5 mb-2">
                <svg className="w-5 h-5 text-amber" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                </svg>
                <span className="font-mono text-lg font-bold text-ink group-hover:text-amber transition-colors">
                  {p.name || p.file}
                </span>
              </div>
              <p className="text-dim text-sm leading-relaxed font-sans line-clamp-3">
                {lang === 'tr' && p.descTr ? p.descTr : p.desc}
              </p>

              <div className="mt-4 p-2.5 rounded bg-black/30 border border-line font-mono text-xs text-amber flex items-center justify-between">
                <code>$ git clone {p.href}.git</code>
                <span className="text-[11px] text-dim opacity-70 group-hover:opacity-100">open ↗</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-line/60 font-mono text-xs">
              <div className="flex items-center gap-4">
                {p.language && (
                  <span className="flex items-center gap-1.5 text-ink">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.language}
                  </span>
                )}
                <span className="flex items-center gap-1 text-dim">
                  ★ {p.stars}
                </span>
                {p.forks > 0 && (
                  <span className="flex items-center gap-1 text-dim">
                    ⑂ {p.forks}
                  </span>
                )}
              </div>
              <span className="text-amber font-mono text-xs flex items-center gap-1">
                {lang === 'tr' ? 'GitHub’da Gör' : 'View on GitHub'} →
              </span>
            </div>
          </a>

          <ul className="m-0 p-0 list-none border-b border-line">
            {list.map((q, n) => (
              <li key={q.file} className="border-t border-line relative scroll-mt-[calc(var(--nav-h)+0.5rem)]">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-full w-[2px] bg-amber origin-top transition-transform duration-500 ease-out ${
                    n === i ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />
                <a
                  href={q.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => hoverable && pick(n)}
                  onFocus={(e) => e.currentTarget.matches(':focus-visible') && setI(n)}
                  onClick={(e) => {
                    if (hoverable) return;
                    if (n === i && e.target.closest('[data-open]')) return;
                    e.preventDefault();
                    if (n === i) return;
                    const row = e.currentTarget.closest('li');
                    setI(n);
                    scrollT.set(
                      () =>
                        row?.scrollIntoView({
                          block: 'nearest',
                          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                        }),
                      520
                    );
                  }}
                  className={`block py-4 pl-4 font-mono transition-transform duration-500 ease-out ${
                    n === i ? 'translate-x-1' : ''
                  }`}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="text-[12px] text-dim">{String(n + 1).padStart(2, '0')}</span>
                    <span
                      className={`text-[15px] transition-colors duration-500 ${
                        n === i ? 'text-amber' : 'text-ink'
                      }`}
                    >
                      {q.file}
                    </span>
                    <span className="feat-chev ml-auto pr-3" data-on={n === i || undefined} aria-hidden="true">
                      ›
                    </span>
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      n === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <span className="block overflow-hidden min-h-0">
                      <span className="block mt-3 pl-8 text-[13px] leading-relaxed">
                        <span className="block text-dim font-sans">{lang === 'tr' && q.descTr ? q.descTr : q.desc}</span>
                        {q.facts?.map(([k, v]) => (
                          <span key={k} className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 mt-1.5">
                            <span className="text-dim">{k}</span>
                            <span className="text-ink break-words">{v}</span>
                          </span>
                        ))}
                        <span data-open className="feat-open">
                          {lang === 'tr' ? 'aç →' : 'open →'}
                        </span>
                      </span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10">
          <PageLink view="projects" onNavigate={onNavigate}>
            <Scramble>{dict.home.allProjects}</Scramble> <HlArrow />
          </PageLink>
        </div>
      </div>
    </section>
  );
}

export function AboutTeaser({ onNavigate }) {
  const { dict, lang } = useLang();
  return (
    <section id="about-me" className={SECTION_ANCHOR}>
      <div className={WRAP}>
        <SectionHead num="02" title={labelOf('about')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-ink text-lg leading-relaxed max-w-[460px]">
              {dict.about.readmeContent}
            </p>
            <ul className="flex flex-wrap gap-2 mt-6 p-0 list-none">
              {stack.map((s) => (
                <li key={s} className="chip" style={TECH_COLORS[s] ? { '--c': TECH_COLORS[s] } : undefined}>
                  <TechIcon name={s} />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <PageLink view="about" onNavigate={onNavigate}>
                <Scramble>{dict.home.moreAboutMe}</Scramble> <HlArrow />
              </PageLink>
            </div>
          </div>
          <div className="bg-inset border border-line rounded-[10px] px-[22px] py-5 font-mono text-[13px] leading-[1.9]">
            <div className="text-dim mb-3">$ git log --oneline -5</div>
            <ol className="m-0 p-0 list-none">
              {gitLog.slice(-5).map((e) => {
                const message = lang === 'tr' ? (e.msgTr || e.msg) : (e.msgEn || e.msg);
                return (
                  <li key={e.hash} className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_5rem_1fr] gap-x-3">
                    <span style={{ color: 'var(--amber)' }}>{e.hash}</span>
                    <span style={{ color: 'var(--green)' }}>{e.date}</span>
                    <span className="col-span-2 sm:col-span-1">{message}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LabTeaser({ onNavigate }) {
  const { dict } = useLang();
  return (
    <section id="lab-teaser" className={SECTION_ANCHOR}>
      <div className={WRAP}>
        <SectionHead num="03" title={labelOf('lab')} />
        <p className="text-dim text-base max-w-[480px]">{dict.home.labDesc}</p>
        <ul className="flex flex-wrap gap-2.5 mt-6 p-0 list-none">
          {LAB_ITEMS.map((i) => (
            <li key={i.slug}>
              <PageLink
                view={`lab/${i.slug}`}
                onNavigate={onNavigate}
                className="chip tag-lab"
                data-kind={i.kind}
              >
                <LabIcon name={i.slug} size={16} />
                {i.file}
              </PageLink>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <PageLink view="lab" onNavigate={onNavigate}>
            <Scramble>{dict.home.openLab}</Scramble> <HlArrow />
          </PageLink>
        </div>
      </div>
    </section>
  );
}

export function TerminalSection({ onNavigate }) {
  const { skin } = useSkin();
  const { dict } = useLang();
  if (skin === 'retro-os') return null;
  return (
    <section id="terminal" className={SECTION_ANCHOR}>
      <div className={WRAP}>
        <p className="font-mono text-[12.5px] text-dim mb-5">{dict.terminal.promptNote}</p>
        <Terminal onNavigate={onNavigate} />
      </div>
    </section>
  );
}
