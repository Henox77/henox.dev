import { repoUrl } from '../../config/site.js';

export default {
  order: 2,
  featured: true,
  tags: ["c#","desktop","tool"],
  file: 'optimizer.cs',
  desc: 'Lightweight open-source Windows OS performance optimizer & latency reducer',
  descTr: 'Windows işletim sistemi için gecikme azaltıcı, hafif ve açık kaynaklı performans optimize aracı',
  color: '#c792ea',
  facts: [["platform","Windows"],["language","C# .NET"]],
  href: repoUrl('hnx-os-optimizer'),
};
