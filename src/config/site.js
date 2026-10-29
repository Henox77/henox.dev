export const site = {
  name: 'Henox',
  realName: 'Henox',
  id: 'henox',
  handle: 'henox.dev',
  year: 2026,

  role: 'Full-Stack Developer',
  roleTr: 'Full-Stack Geliştirici',
  roleEn: 'Full-Stack Developer',

  location: 'Istanbul',
  locationTr: 'İstanbul',
  locationEn: 'Istanbul',
  country: 'TR',
  host: 'henox-box',
  email: 'contact@henox.dev',
  phone: '905000000000',

  timezone: 'Europe/Istanbul',
  schedule: { dawn: 6, day: 9, dusk: 18, night: 24 },

  githubUser: 'Henox77',
  repo: 'henox.dev',

  description: "Henox's portfolio: full-stack web development, modern software architecture, and open source projects.",
  descriptionEn: "Henox's portfolio: full-stack web development, modern software architecture, and open source projects.",
  descriptionTr: "Henox'un portfolyosu: full-stack web geliştirme, modern yazılım mimarileri ve açık kaynak projeler.",

  content: {
    en: {
      phrases: [
        'Building full-stack web applications.',
        'Designing modern, high-performance systems.',
        'Working on open source technologies.',
        'Crafting scalable software solutions.',
      ],
      heroIntro: 'Developing modern web technologies and scalable software solutions.',
      heroNote: 'Open to new projects and collaboration.',
      mood: 'Focused, productive, and exploring modern technologies.',
      teaLine: 'Continuous learning and clean code.',
      funFact: 'Focusing on performance optimization and clean architecture',
      drink: 'coffee',
      classes: ['Full-Stack Developer', 'Software Engineer', 'Frontend Developer', 'Backend Developer'],
    },
    tr: {
      phrases: [
        'Full-stack web uygulamaları geliştiriyorum.',
        'Modern ve performanslı sistemler tasarlıyorum.',
        'Açık kaynak teknolojiler üzerine çalışıyorum.',
        'Ölçeklenebilir çözümler inşa ediyorum.',
      ],
      heroIntro: 'Modern web teknolojileri ve ölçeklenebilir yazılım çözümleri geliştiriyorum.',
      heroNote: 'Yeni projeler ve iş birlikleri için iletişime geçebilirsiniz.',
      mood: 'Üretken, odaklanmış ve yeni teknolojileri araştıran.',
      teaLine: 'Sürekli öğrenme ve temiz kod odaklı.',
      funFact: 'Performans optimizasyonu ve temiz mimari üzerine odaklanma',
      drink: 'kahve',
      classes: ['Full-Stack Geliştirici', 'Yazılım Mühendisi', 'Arayüz Geliştirici', 'Backend Geliştirici'],
    },
    phrases: [
      'Building full-stack web applications.',
      'Designing modern, high-performance systems.',
      'Working on open source technologies.',
      'Crafting scalable software solutions.',
    ],
    heroIntro: 'Developing modern web technologies and scalable software solutions.',
    heroNote: 'Open to new projects and collaboration.',
    mood: 'Focused, productive, and exploring modern technologies.',
    teaLine: 'Continuous learning and clean code.',
    funFact: 'Focusing on performance optimization and clean architecture',
    drink: 'coffee',
    classes: ['Full-Stack Developer', 'Software Engineer', 'Frontend Developer', 'Backend Developer'],
  },
};

export const githubUrl = `https://github.com/${site.githubUser}`;
export const repoUrl = (name = site.repo) => `${githubUrl}/${name}`;
export const siteUrl = `https://${site.handle}/`;
export const base = `/`;
export const title = `${site.name} — ${site.role}`;
export const storageKey = (name) => `${site.id}-${name}`;
