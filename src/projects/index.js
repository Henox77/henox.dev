import { FALLBACK_REPOS } from '../lib/github.js';

export const projects = FALLBACK_REPOS;

export const tags = [...new Set(projects.flatMap((p) => p.tags ?? []))].sort();

export const featured = (() => {
  const f = projects.filter((p) => p.featured);
  return (f.length ? f : projects).slice(0, 4);
})();

export const arts = {};
