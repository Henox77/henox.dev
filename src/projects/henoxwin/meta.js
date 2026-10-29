import { repoUrl } from '../../config/site.js';

export default {
  order: 10,
  tags: ["os","simulation","web"],
  file: 'desktop.html',
  desc: 'Interactive Windows desktop simulator running entirely in browser DOM',
  descTr: 'Tarayıcı içinde çalışan interaktif Windows masaüstü deneyimi',
  color: '#38bdf8',
  facts: [["type","OS simulator"],["env","in-browser"]],
  href: repoUrl('henoxwin'),
};
