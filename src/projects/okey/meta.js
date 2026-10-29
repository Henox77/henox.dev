import { repoUrl } from '../../config/site.js';

export default {
  order: 4,
  tags: ["game","ts","multiplayer"],
  file: 'okey-game.ts',
  desc: 'Real-time multiplayer Okey board game built with WebSockets & React',
  descTr: 'WebSockets ve React ile geliştirilmiş çok oyunculu gerçek zamanlı Okey oyunu',
  color: '#ff5370',
  facts: [["type","multiplayer game"],["net","WebSockets"]],
  href: repoUrl('okey'),
};
