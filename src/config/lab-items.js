import { lazy } from 'react';

export const LAB_KINDS = ['game', 'toy', 'tool'];

export const LAB_ITEMS = [
  {
    slug: 'reptile',
    file: 'reptile.js',
    name: 'Reptile',
    kind: 'toy',
    blurb: 'A procedural lizard with a random number of legs. Hit the button for a new one.',
    Component: lazy(() => import('../components/lab/Reptile/Reptile.jsx')),
  },
  {
    slug: 'mother',
    file: 'mother.js',
    name: 'Mother',
    kind: 'toy',
    blurb: 'She sleeps in the dark under a lot of hair. Poke her and her children crawl out. When she opens her eyes, do not move.',
    Component: lazy(() => import('../components/lab/Mother/Mother.jsx')),
  },
  {
    slug: 'choir',
    file: 'choir.js',
    name: 'Choir',
    kind: 'toy',
    blurb: 'They stand in the dark and stare straight out of the screen. Keep them singing. If you stop, they come closer. Sound on.',
    Component: lazy(() => import('../components/lab/Choir/Choir.jsx')),
  },
  {
    slug: 'moths',
    file: 'moths.js',
    name: 'Moths',
    kind: 'toy',
    blurb: 'Your cursor is a lamp and the moths cannot leave it alone. Switch it off, blow out the candle, shake the lamp, and watch out for the bat.',
    Component: lazy(() => import('../components/lab/Moths/Moths.jsx')),
  },
  {
    slug: 'cat',
    file: 'cat.css',
    name: 'Upside-down cat',
    kind: 'toy',
    blurb: 'A cat running upside-down. Pure CSS animation, no JavaScript state.',
    frame: { background: '#ff9a2e' },
    Component: lazy(() => import('../components/lab/Cat/Cat.jsx')),
  },
  {
    slug: 'ghost',
    file: 'ghost.css',
    name: 'Floating ghost',
    kind: 'toy',
    blurb: 'A floating CSS ghost. Poke it, flip day and night, find the hidden lines.',
    frame: {},
    Component: lazy(() => import('../components/lab/Ghost/Ghost.jsx')),
  },
  {
    slug: 'banner-maker',
    file: 'banner-maker.js',
    name: 'Banner maker',
    kind: 'tool',
    blurb: 'Stack patterns and dyes into a banner, then copy the code.',
    Component: lazy(() => import('../components/lab/BannerMaker/BannerMaker.jsx')),
  },
  {
    slug: 'bug-squash',
    file: 'bug-squash.js',
    name: 'Bug squash',
    kind: 'game',
    blurb: 'Squash bugs for 30 seconds. Beat your best score.',
    Component: lazy(() => import('../components/lab/games/BugSquash.jsx')),
  },
  {
    slug: 'memory-match',
    file: 'memory-match.js',
    name: 'Memory match',
    kind: 'game',
    blurb: 'Flip cards and match the code symbols in the fewest moves.',
    Component: lazy(() => import('../components/lab/games/MemoryMatch.jsx')),
  },
  {
    slug: 'snake',
    file: 'snake.js',
    name: 'Snake',
    kind: 'game',
    blurb: 'Classic snake on an 18×18 grid. Keyboard or on-screen pad.',
    Component: lazy(() => import('../components/lab/games/Snake.jsx')),
  },
];

export const labItemOf = (slug) => LAB_ITEMS.find((i) => i.slug === slug);
