import { createElement, lazy } from 'react';
import { LAB_ITEMS, labItemOf } from './lab-items.js';

import { BASE, pathOf } from '../lib/paths.js';
import { site, title as HOME_TITLE } from './site.js';

function lazyPage(load) {
  let Loaded = null;
  const Lazy = lazy(load);
  const Page = (props) => createElement(Loaded || Lazy, props);
  Page.preload = () => load().then((m) => { Loaded = m.default; });
  return Page;
}
const About = lazyPage(() => import('../components/about/About.jsx'));
const Projects = lazyPage(() => import('../projects/Projects.jsx'));
const Lab = lazyPage(() => import('../components/lab/Lab/Lab.jsx'));

export const PAGES = [
  {
    id: 'about',
    label: 'about.js',
    title: `about.js — ${site.name}`,
    Component: About,
    preload: About.preload,
    sub: [
      { href: '#about-intro', label: 'about.js' },
      { href: '#about-journey', label: 'log.sh' },
      { href: '#about-skills', label: 'skills.js' },
    ],
  },
  {
    id: 'projects',
    label: 'projects/',
    title: `projects/ — ${site.name}`,
    Component: Projects,
    preload: Projects.preload,
    sub: [],
  },
  {
    id: 'lab',
    label: 'lab.css',
    title: `lab.css — ${site.name}`,
    Component: Lab,
    preload: Lab.preload,
    children: LAB_ITEMS.map((i) => i.slug),
    sub: LAB_ITEMS.map((i) => ({ view: `lab/${i.slug}`, href: pathOf(`lab/${i.slug}`), label: i.file })),
  },
];

export const labelOf = (id) => PAGES.find((p) => p.id === id)?.label ?? id;
export const CONTACT = { id: 'contact', href: '#contact', label: 'contact.sh' };

export const topOf = (view) => view.split('/')[0];
const pageOf = (id) => PAGES.find((p) => p.id === id);
export const pageOfView = (view) => pageOf(topOf(view));

export const titleOf = (view) => {
  const slug = view.split('/')[1];
  const item = slug && labItemOf(slug);
  if (topOf(view) === 'lab' && item) return `${item.file} — ${site.name}`;
  return pageOfView(view)?.title ?? HOME_TITLE;
};

export const viewFromLocation = () => {
  const rest = location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : '';
  const name = rest.replace(/\/+$/, '');
  if (pageOf(name)) return name;
  const [top, child, ...more] = name.split('/');
  const page = pageOf(top);
  if (!page) return 'home';
  return page.children?.includes(child) && !more.length ? `${top}/${child}` : top;
};
