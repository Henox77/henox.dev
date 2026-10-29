import { repoUrl } from '../../config/site.js';

export default {
  order: 7,
  tags: ["finance","api","ts"],
  file: 'borsa-feed.ts',
  desc: 'Live stock market feed, financial news aggregation and market analysis',
  descTr: 'Canlı borsa verileri, finans haberleri ve piyasa analiz platformu',
  color: '#4ade80',
  facts: [["type","fintech"],["data","live feed"]],
  href: repoUrl('borsahaberler'),
};
