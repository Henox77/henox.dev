

export const site = {

  name: 'Henox',
  realName: 'Henox',
  id: 'henox',
  handle: 'henox.dev',
  year: 2026,

  role: 'Full-Stack Developer',
  location: 'Istanbul',
  country: 'TR',
  host: 'henox-box',
  email: 'contact@henox.dev',
  phone: '905000000000',

  timezone: 'Europe/Istanbul',
  schedule: { dawn: 6, day: 9, dusk: 18, night: 24 },

  githubUser: 'Henox77',
  repo: 'henox.dev',

  description: "Henox's portfolio: a full-stack developer crafting clean code, modern web apps and retro terminal experiences.",

  content: {
    phrases: [
      'I code with passion.',
      'I craft modern web apps.',
      'I fix 3am bugs.',
      'I play with CSS & creative code.',
      'I build full-stack solutions.',
    ],
    heroIntro: 'I love crafting clean web experiences, building playful interactive interfaces, and exploring new technologies.',
    heroNote: 'focused by default. say hi anyway →',
    mood: 'chill, curious, shipping clean and playful stuff.',
    teaLine: 'coffee && tea. fuel for thought.',
    funFact: 'debugging CSS & React state machines until dawn without getting bored',
    drink: 'coffee',
    classes: ['Software Developer', 'Bug Hunter', 'CSS Wizard', 'Coffee Lover', 'Night Owl (lvl 99)'],
  },
};

export const githubUrl = `https://github.com/${site.githubUser}`;
export const repoUrl = (name = site.repo) => `${githubUrl}/${name}`;
export const siteUrl = `https://${site.handle}/`;
export const base = `/`;
export const title = `${site.name} — ${site.role}`;
export const storageKey = (name) => `${site.id}-${name}`;
