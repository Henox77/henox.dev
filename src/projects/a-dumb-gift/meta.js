import { repoUrl } from '../../config/site.js';

export default {
  order: 1,
  tags: ['gift', 'html'],
  file: 'a-dumb-gift.js',
  desc: 'a small gift, hand-coded, runs straight in the browser',
  descTr: 'tarayıcıda doğrudan çalışan, el yapımı interaktif bir hediye sayfası',
  color: 'var(--js)',
  facts: [
    ['type', 'gift page'],
    ['runs', 'straight in the browser'],
    ['mood', 'dumb but cute'],
  ],
  href: repoUrl('a-dumb-gift'),
};
