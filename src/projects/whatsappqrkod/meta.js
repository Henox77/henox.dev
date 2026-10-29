import { repoUrl } from '../../config/site.js';

export default {
  order: 11,
  tags: ["tool","auth","js"],
  file: 'qr-auth.js',
  desc: 'Fast QR code generator and session authentication helper for WhatsApp Web',
  descTr: 'WhatsApp Web istemcileri için hızlı QR kod kimlik doğrulama yardımcısı',
  color: '#25D366',
  facts: [["type","utility"],["service","WhatsApp Web"]],
  href: repoUrl('whatsappqrkod'),
};
