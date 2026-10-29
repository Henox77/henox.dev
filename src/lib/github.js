import { useEffect, useMemo, useState } from 'react';
import { site, repoUrl } from '../config/site.js';
import { TECH_COLORS } from '../config/tech.js';

export const FALLBACK_REPOS = [
  {
    name: 'henox.app',
    file: 'henox.app',
    desc: 'Creative web application platform and interactive developer utilities',
    descTr: 'Gelişmiş web uygulama platformu ve yaratıcı araçlar',
    href: repoUrl('henox.app'),
    stars: 2,
    forks: 0,
    language: 'TypeScript',
    color: TECH_COLORS['TypeScript'] || '#3178c6',
    featured: true,
    tags: ['typescript', 'react', 'web'],
    facts: [['type', 'web app'], ['language', 'TypeScript'], ['stars', '2 ★']],
  },
  {
    name: 'secure-share',
    file: 'secure-share',
    desc: 'SecureShare - Privacy-focused end-to-end encrypted file sharing service',
    descTr: 'SecureShare - Gizlilik odaklı, uçtan uca şifreli dosya paylaşım servisi',
    href: repoUrl('secure-share'),
    stars: 2,
    forks: 0,
    language: 'JavaScript',
    color: TECH_COLORS['JavaScript'] || '#f7df1e',
    featured: true,
    tags: ['javascript', 'security', 'privacy'],
    facts: [['type', 'file sharing'], ['language', 'JavaScript'], ['stars', '2 ★']],
  },
  {
    name: 'tiktokotomasyon',
    file: 'tiktokotomasyon',
    desc: 'Automated video rendering, scheduling and content distribution bot',
    descTr: 'Otomatik video renderlama, zamanlama ve içerik dağıtım otomasyon botu',
    href: repoUrl('tiktokotomasyon'),
    stars: 2,
    forks: 0,
    language: 'JavaScript',
    color: '#ff2a6d',
    featured: true,
    tags: ['javascript', 'automation', 'bot'],
    facts: [['type', 'automation'], ['language', 'JavaScript'], ['stars', '2 ★']],
  },
  {
    name: 'hnx-os-optimizer',
    file: 'hnx-os-optimizer',
    desc: 'Lightweight open-source Windows OS latency reducer and performance optimizer',
    descTr: 'Windows işletim sistemi için gecikme azaltıcı, hafif ve açık kaynaklı performans optimizasyonu',
    href: repoUrl('hnx-os-optimizer'),
    stars: 1,
    forks: 0,
    language: 'C#',
    color: TECH_COLORS['ASP.NET Core'] || '#c792ea',
    featured: true,
    tags: ['c#', 'windows', 'tool'],
    facts: [['platform', 'Windows'], ['language', 'C# .NET'], ['stars', '1 ★']],
  },
  {
    name: 'cekici',
    file: 'cekici',
    desc: 'Tow truck & 24/7 roadside assistance tracking service platform',
    descTr: 'Oto kurtarma ve 7/24 yol yardım hizmeti yönetim platformu',
    href: repoUrl('cekici'),
    stars: 1,
    forks: 0,
    language: 'PHP',
    color: TECH_COLORS['PHP'] || '#777bb4',
    tags: ['php', 'web', 'platform'],
    facts: [['type', 'service platform'], ['language', 'PHP'], ['stars', '1 ★']],
  },
  {
    name: 'henoxportfolio',
    file: 'henoxportfolio',
    desc: 'Interactive developer portfolio with modern animations and themes',
    descTr: 'Modern animasyonlar ve temalar barındıran interaktif portfolyo web sitesi',
    href: repoUrl('henoxportfolio'),
    stars: 2,
    forks: 0,
    language: 'TypeScript',
    color: TECH_COLORS['React'] || '#61dafb',
    tags: ['typescript', 'react', 'portfolio'],
    facts: [['type', 'portfolio'], ['language', 'TypeScript'], ['stars', '2 ★']],
  },
  {
    name: 'henoxwin',
    file: 'henoxwin',
    desc: 'Interactive Windows desktop simulator running entirely in browser DOM',
    descTr: 'Tarayıcı içinde çalışan interaktif Windows masaüstü deneyimi',
    href: repoUrl('henoxwin'),
    stars: 0,
    forks: 0,
    language: 'HTML',
    color: TECH_COLORS['HTML5'] || '#38bdf8',
    tags: ['html', 'css', 'simulation'],
    facts: [['type', 'simulator'], ['language', 'HTML5'], ['stars', '0 ★']],
  },
  {
    name: 'mcqueendate',
    file: 'mcqueendate',
    desc: 'Playful Lightning McQueen themed interactive date invitation page',
    descTr: 'Şimşek McQueen temalı eğlenceli ve interaktif randevu davet sayfası',
    href: repoUrl('mcqueendate'),
    stars: 1,
    forks: 0,
    language: 'CSS',
    color: '#ef4444',
    tags: ['css', 'html', 'fun'],
    facts: [['type', 'web page'], ['language', 'CSS3'], ['stars', '1 ★']],
  },
  {
    name: 'henox.com.tr',
    file: 'henox.com.tr',
    desc: 'Personal landing page and showcase for henox.com.tr domain',
    descTr: 'henox.com.tr için tasarlanmış kişisel açılış ve vitrin sayfası',
    href: repoUrl('henox.com.tr'),
    stars: 1,
    forks: 0,
    language: 'CSS',
    color: '#06b6d4',
    tags: ['css', 'personal', 'web'],
    facts: [['type', 'landing page'], ['language', 'CSS3'], ['stars', '1 ★']],
  },
  {
    name: 'portfolio2',
    file: 'portfolio2',
    desc: 'Alternative portfolio design and interactive UI sandbox',
    descTr: 'Alternatif portfolyo tasarımı ve interaktif UI denemeleri',
    href: repoUrl('portfolio2'),
    stars: 1,
    forks: 0,
    language: 'TypeScript',
    color: '#3b8eea',
    tags: ['typescript', 'react'],
    facts: [['type', 'portfolio'], ['language', 'TypeScript'], ['stars', '1 ★']],
  },
  {
    name: 'henoxdev',
    file: 'henoxdev',
    desc: 'Developer tools, playground, and personal experiments showcase',
    descTr: 'Geliştirici araçları ve kişisel deneyler vitrini',
    href: repoUrl('henoxdev'),
    stars: 2,
    forks: 0,
    language: 'TypeScript',
    color: '#6366f1',
    tags: ['typescript', 'react', 'tools'],
    facts: [['type', 'dev tools'], ['language', 'TypeScript'], ['stars', '2 ★']],
  },
  {
    name: 'kisiselweb',
    file: 'kisiselweb',
    desc: 'Minimalist personal web page design with responsive styling',
    descTr: 'Minimalist kişisel web sayfası ve duyarlı arayüz tasarımı',
    href: repoUrl('kisiselweb'),
    stars: 2,
    forks: 0,
    language: 'CSS',
    color: '#a855f7',
    tags: ['css', 'html'],
    facts: [['type', 'personal web'], ['language', 'CSS3'], ['stars', '2 ★']],
  },
  {
    name: 'babakralsitev3',
    file: 'babakralsitev3',
    desc: 'Creative personal web experiments and custom JavaScript animations',
    descTr: 'Yaratıcı kişisel web deneyleri ve JavaScript animasyonları',
    href: repoUrl('babakralsitev3'),
    stars: 1,
    forks: 0,
    language: 'JavaScript',
    color: '#eab308',
    tags: ['javascript', 'creative'],
    facts: [['type', 'web experiment'], ['language', 'JavaScript'], ['stars', '1 ★']],
  },
  {
    name: 'henoxbaba',
    file: 'henoxbaba',
    desc: 'JavaScript web utility and experimental interaction sandbox',
    descTr: 'JavaScript web aracı ve deneysel arayüz geliştirmeleri',
    href: repoUrl('henoxbaba'),
    stars: 1,
    forks: 0,
    language: 'JavaScript',
    color: '#10b981',
    tags: ['javascript', 'tools'],
    facts: [['type', 'utility'], ['language', 'JavaScript'], ['stars', '1 ★']],
  },
  {
    name: 'henox.com.trv1',
    file: 'henox.com.trv1',
    desc: 'First version script and interactive layout for henox.com.tr',
    descTr: 'henox.com.tr ilk versiyon tasarımı ve interaktif scriptleri',
    href: repoUrl('henox.com.trv1'),
    stars: 1,
    forks: 0,
    language: 'JavaScript',
    color: '#06b6d4',
    tags: ['javascript', 'web'],
    facts: [['type', 'web page'], ['language', 'JavaScript'], ['stars', '1 ★']],
  },
];

const CACHE_KEY = `gh_repos_${site.githubUser}`;
const CACHE_TIME_KEY = `gh_repos_time_${site.githubUser}`;
const CACHE_TTL_MS = 10 * 60 * 1000;

export function getCachedRepos() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    const time = Number(sessionStorage.getItem(CACHE_TIME_KEY) || 0);
    if (raw && Date.now() - time < CACHE_TTL_MS) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function saveCachedRepos(repos) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(repos));
    sessionStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
  } catch {}
}

export function mapGithubRepo(r) {
  const lang = r.language || 'Code';
  const color = TECH_COLORS[lang] || 'var(--amber)';
  const tags = [
    lang.toLowerCase(),
    ...(r.topics ?? []),
  ].filter(Boolean);

  return {
    name: r.name,
    file: r.name,
    desc: r.description || `${r.name} - Open source repository by ${site.name}`,
    descTr: r.description || `${r.name} - ${site.name} tarafından geliştirilen açık kaynak proje`,
    href: r.html_url,
    homepage: r.homepage || null,
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    language: lang,
    color,
    tags,
    featured: (r.stargazers_count ?? 0) > 0 || ['henox.app', 'secure-share', 'hnx-os-optimizer', 'tiktokotomasyon'].includes(r.name),
    updatedAt: r.updated_at,
    facts: [
      ['repo', r.full_name || `${site.githubUser}/${r.name}`],
      ['language', lang],
      ['stars', `${r.stargazers_count ?? 0} ★`],
      ['forks', `${r.forks_count ?? 0}`],
    ],
  };
}

export async function fetchGithubRepos(username = site.githubUser, signal) {
  const cached = getCachedRepos();
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return cached;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      signal,
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Expected array of repos');

    const repos = data
      .filter((r) => !r.private && r.name !== username && r.name !== `${username}.github.io`)
      .map(mapGithubRepo)
      .sort((a, b) => (b.stars - a.stars) || (a.name > b.name ? 1 : -1));

    if (repos.length > 0) {
      saveCachedRepos(repos);
      return repos;
    }
  } catch (err) {
    console.warn('GitHub fetch fallback:', err);
  }

  return FALLBACK_REPOS;
}

export function useGithubRepos() {
  const [repos, setRepos] = useState(() => getCachedRepos() || FALLBACK_REPOS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    setLoading(true);
    fetchGithubRepos(site.githubUser, ctl.signal)
      .then((data) => {
        if (data && data.length) setRepos(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctl.abort();
  }, []);

  const tags = useMemo(() => {
    return [...new Set(repos.flatMap((p) => p.tags ?? []))].sort();
  }, [repos]);

  const featured = useMemo(() => {
    const f = repos.filter((p) => p.featured);
    return (f.length ? f : repos).slice(0, 4);
  }, [repos]);

  return { repos, featured, tags, loading };
}

