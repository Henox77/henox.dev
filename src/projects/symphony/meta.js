import { repoUrl } from '../../config/site.js';

export default {
  order: 2,
  tags: ['sound', 'js'],
  file: 'symphony.js',
  desc: 'experiments with sound and interaction on the web',
  descTr: 'web üzerinde ses sentezi, web audio api ve interaktif etkileşim deneyleri',
  color: 'var(--js)',
  facts: [
    ['type', 'sound toy'],
    ['made with', 'audio + JS'],
    ['mood', 'press things, hear things'],
  ],
  href: repoUrl('symphony'),
};
