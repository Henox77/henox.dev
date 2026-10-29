import { lazy } from 'react';

const modules = import.meta.glob('./*/meta.js', { eager: true });

export const projects = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export const tags = [...new Set(projects.flatMap((p) => p.tags ?? []))].sort();

export const featured = (() => {
  const f = projects.filter((p) => p.featured);
  return (f.length ? f : projects).slice(0, 3);
})();

const artLoaders = import.meta.glob('./*/Art.jsx');
export const arts = Object.fromEntries(
  Object.entries(artLoaders).map(([path, load]) => [path.split('/')[1], lazy(load)]),
);
