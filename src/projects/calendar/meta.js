import { repoUrl } from '../../config/site.js';

export default {
  order: 5,
  tags: ['app', 'js'],
  file: 'calendar.js',
  desc: 'a compact little calendar app, built by hand',
  descTr: 'özenle hazırlanmış, kompakt ve hızlı bir takvim web uygulaması',
  color: 'var(--js)',
  facts: [
    ['type', 'calendar app'],
    ['built', 'by hand'],
  ],
  href: repoUrl('calendar'),
  manualShot: true,
};
