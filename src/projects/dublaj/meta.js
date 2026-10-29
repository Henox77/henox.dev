import { repoUrl } from '../../config/site.js';

export default {
  order: 3,
  featured: true,
  tags: ["ai","audio","ts"],
  file: 'dublaj.ts',
  desc: 'Browser-based voiceover, speech synthesis and media dubbing studio',
  descTr: 'Tarayıcı tabanlı seslendirme, konuşma sentezi ve medya dublaj stüdyosu',
  color: '#00f0ff',
  facts: [["type","audio studio"],["engine","Web Audio API"]],
  href: repoUrl('dublaj'),
};
