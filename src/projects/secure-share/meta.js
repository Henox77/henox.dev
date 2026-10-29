import { repoUrl } from '../../config/site.js';

export default {
  order: 3,
  featured: true,
  tags: ["security","privacy","share","js"],
  file: 'secure-share.js',
  desc: 'Privacy-focused file sharing service with end-to-end encryption',
  descTr: 'Gizlilik odaklı, uçtan uca şifreli dosya paylaşım servisi',
  color: '#22c55e',
  facts: [["type","file sharing"],["privacy","E2E encrypted"]],
  href: repoUrl('secure-share'),
};

