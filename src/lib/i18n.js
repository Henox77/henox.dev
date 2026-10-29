import { site } from '../config/site.js';
import { startYear, mainStack, learning } from '../data/profile.js';

export const LANG_STORAGE_KEY = `${site.id}-lang`;

export const getInitialLang = () => {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'tr' || saved === 'en') return saved;
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('tr')) {
      return 'tr';
    }
  } catch {
    // Ignore storage errors
  }
  return 'tr';
};

export const DICTIONARY = {
  tr: {
    nav: {
      about: 'hakkimda.js',
      projects: 'projeler/',
      lab: 'laboratuvar.css',
      contact: 'iletisim.sh',
      cdBack: 'cd ..',
      jumpTo: 'hızlı geçiş',
      lsHome: 'dizin listesi ~/',
      changeSkin: 'tema değiştir',
      openSkins: 'Temalar (Ctrl+K)',
      toggleLang: 'Dil: TR',
      switchLangHint: 'Switch to English',
    },

    hero: {
      ariaLabel: `Merhaba, ben ${site.name}.`,
      hi: 'Merhaba, ben',
      phrases: [
        'Full-stack web uygulamaları geliştiriyorum.',
        'Modern ve performanslı sistemler tasarlıyorum.',
        'Açık kaynak teknolojiler üzerine çalışıyorum.',
        'Ölçeklenebilir çözümler inşa ediyorum.',
      ],
      intro: 'Modern web teknolojileri ve ölçeklenebilir yazılım çözümleri geliştiriyorum.',
      note: 'Yeni projeler ve iş birlikleri için iletişime geçebilirsiniz.',
      viewProjects: 'projeleri incele',
      contactMe: 'iletişime geç',
      scrollToContinue: 'Devam etmek için kaydır',
      projectsLink: 'Projeler',
    },

    card: {
      statusAuto: '· oto',
      classTitle: 'Rolü değiştirmek için tıkla',
      classes: ['Full-Stack Geliştirici', 'Yazılım Mühendisi', 'Arayüz Geliştirici', 'Backend Geliştirici'],
      location: 'konum',
      mainQuest: 'ana odak',
      sideQuest: 'öğrenilenler',
      socialBattery: 'durum',
      personality: 'profil',
      personalityHint: 'henox.dev',
      sayHi: '$ selam ver',
      sayHiReplies: [
        'Merhaba! Sayfama hoş geldiniz.',
        'Selam! Projelerimi incelemekten çekinmeyin.',
        'Yeni projeler ve fikirler için iletişime geçebilirsiniz.',
        'Birlikte değer katan projeler inşa edebiliriz.',
      ],
      sleepingNote: 'Şu an çevrimdışı.',
    },

    terminal: {
      promptNote: 'bir komut yazın veya aşağıdaki hazır seçeneklerden birine tıklayın',
      whoami: `${site.id} - ${site.roleTr.toLowerCase()}, ${site.locationTr}`,
      mood: 'Üretken, odaklanmış ve yeni teknolojileri araştıran.',
      teaLine: 'Sürekli öğrenme ve temiz kod odaklı.',
      quick: [
        ['kimsin sen?', 'whoami'],
        ['durumun nasıl?', 'cat mood.txt'],
        ['neler kullanıyorsun?', 'cat stack.txt'],
        ['projeleri göster', 'cd projects'],
        ['seninle çalışabilir miyim?', `sudo hire ${site.id}`],
        ['rastgele tema', 'theme random'],
      ],
      help: `help | ls | cat <dosya> | cd <sayfa> | whoami | date | battery | theme | clear`,
      helpHint: `dene: sudo hire ${site.id}, ya da theme list`,
      hireResp: 'Harika! Birlikte çalışmak veya iletişime geçmek için GitHub üzerinden ulaşabilirsiniz.',
    },

    home: {
      featuredTitle: 'Öne Çıkan Projeler',
      allProjects: 'Tüm projeler',
      aboutTitle: 'Hakkımda',
      moreAboutMe: 'Hakkımda daha fazlası',
      labTitle: 'Laboratuvar',
      labDesc: 'Deneysel arayüz çalışmaları ve prototipler.',
      openLab: 'Laboratuvarı aç',
    },

    about: {
      subtitle: 'hakkımda detaylar ve teknoloji yığını',
      yearsCoding: 'yıldır yazılım geliştiriyor',
      commitsLife: 'geliştirme günlüğü kaydı',
      toolsStack: 'kullanılan teknoloji & araç',
      readmeTitle: 'beni-oku.md',
      readmeContent: `${startYear}'den beri yazılım geliştiriyorum. Tercih ettiğim teknoloji yığını ${mainStack} ve şu sıralar ${learning} üzerine odaklanıyorum. Modern, performanslı ve ölçeklenebilir web uygulamaları inşa ediyorum.`,
      logTitle: 'günlük.sh',
      skillsTitle: 'yetenekler.js',
      funFact: 'Performans optimizasyonu ve temiz mimari üzerine odaklanma',
      coffeeOrTea: 'kahve',
    },

    projects: {
      subtitle: 'seçkin çalışmalar ve açık kaynak projeler',
      openRepo: 'depoyu aç →',
      deployed: 'Yayında',
      notDeployed: 'Yayında değil',
      checking: 'Kontrol ediliyor…',
      searchPlaceholder: 'projelerde filtrele veya ara…',
      all: 'tümü',
      shelfView: 'kart görünümü',
      listView: 'liste görünümü',
      stars: 'yıldız',
    },

    lab: {
      subtitle: 'deneysel çalışmalar ve arayüz prototipleri',
      matches: 'sonuç eşleşti',
      searchPlaceholder: 'ara…',
      random: 'Rastgele',
      backToGrid: '← Laboratuvara Dön',
    },

    contact: {
      subtitle: 'yeni projeler ve iş birlikleri için bana ulaşabilirsiniz',
      placeholder: 'Mesajınızı buraya yazabilirsiniz...',
      send: 'Mesaj Gönder',
      copied: 'Kopyalandı!',
      copyEmail: 'E-postayı Kopyala',
      mailClientSuccess: 'E-posta uygulamanız açılmalı. Açılmazsa lütfen doğrudan e-posta atın: ',
      tooLong: 'Mesaj e-posta bağlantısı için uzundu, metin panonuza kopyalandı. Lütfen doğrudan yazın: ',
    },

    footer: {
      copy: `© ${site.year} ${site.handle}`,
    },
  },
  en: {
    nav: {
      about: 'about.js',
      projects: 'projects/',
      lab: 'lab.css',
      contact: 'contact.sh',
      cdBack: 'cd ..',
      jumpTo: 'jump to',
      lsHome: 'ls ~/',
      changeSkin: 'change skin',
      openSkins: 'Skins (Ctrl+K)',
      toggleLang: 'Lang: EN',
      switchLangHint: 'Türkçeye geç',
    },

    hero: {
      ariaLabel: `Hi, I'm ${site.name}.`,
      hi: "Hi, I'm",
      phrases: [
        'Building full-stack web applications.',
        'Designing modern, high-performance systems.',
        'Working on open source technologies.',
        'Crafting scalable software solutions.',
      ],
      intro: 'Developing modern web technologies and scalable software solutions.',
      note: 'Open to new projects and collaboration.',
      viewProjects: 'view projects',
      contactMe: 'contact me',
      scrollToContinue: 'Scroll to continue',
      projectsLink: 'Projects',
    },

    card: {
      statusAuto: '· auto',
      classTitle: 'Click to change class',
      classes: ['Full-Stack Developer', 'Software Engineer', 'Frontend Developer', 'Backend Developer'],
      location: 'location',
      mainQuest: 'main focus',
      sideQuest: 'currently learning',
      socialBattery: 'status',
      personality: 'profile',
      personalityHint: 'henox.dev',
      sayHi: '$ say hi',
      sayHiReplies: [
        'Hello! Welcome to my portfolio.',
        'Feel free to explore my open source projects.',
        'Always open to interesting ideas and collaborations.',
        "Let's build something impactful together.",
      ],
      sleepingNote: 'Currently offline.',
    },

    terminal: {
      promptNote: 'type a command, or click an option below',
      whoami: `${site.id} - ${site.roleEn.toLowerCase()}, ${site.locationEn}`,
      mood: 'Focused, productive, and exploring modern technologies.',
      teaLine: 'Continuous learning and clean code.',
      quick: [
        ['who are you?', 'whoami'],
        ['your mood?', 'cat mood.txt'],
        ['what do you use?', 'cat stack.txt'],
        ['show projects', 'cd projects'],
        ['can I hire you?', `sudo hire ${site.id}`],
        ['surprise me', 'theme random'],
      ],
      help: 'help | ls | cat <file> | cd <tab> | whoami | date | battery | theme | clear',
      helpHint: `try: sudo hire ${site.id}, or theme list`,
      hireResp: 'Awesome! To collaborate or discuss a project, feel free to reach out via GitHub.',
    },

    home: {
      featuredTitle: 'Featured Projects',
      allProjects: 'All projects',
      aboutTitle: 'About Me',
      moreAboutMe: 'More about me',
      labTitle: 'Lab Experiments',
      labDesc: 'Experimental interface components and prototypes.',
      openLab: 'Open the lab',
    },

    about: {
      subtitle: 'background details and technology stack',
      yearsCoding: 'years developing software',
      commitsLife: 'commits in activity log',
      toolsStack: 'technologies & tools in stack',
      readmeTitle: 'readme.md',
      readmeContent: `Coding since ${startYear}. Favorite stack is ${mainStack}, and I'm currently exploring ${learning}. Focused on creating fast, interactive, and performant web applications.`,
      logTitle: 'log.sh',
      skillsTitle: 'skills.js',
      funFact: 'Focusing on performance optimization and clean architecture',
      coffeeOrTea: 'coffee',
    },

    projects: {
      subtitle: 'selected works and open source projects',
      openRepo: 'open repo →',
      deployed: 'Deployed',
      notDeployed: 'Not deployed',
      checking: 'Checking deployment…',
      searchPlaceholder: 'filter or search projects…',
      all: 'all',
      shelfView: 'card view',
      listView: 'directory listing',
      stars: 'stars',
    },

    lab: {
      subtitle: 'experimental works and UI prototypes',
      matches: 'match',
      searchPlaceholder: 'search…',
      random: 'Random',
      backToGrid: '← Back to Lab Grid',
    },

    contact: {
      subtitle: 'feel free to reach out for new projects and collaborations',
      placeholder: 'Write your message here...',
      send: 'Send Message',
      copied: 'Copied!',
      copyEmail: 'Copy Email',
      mailClientSuccess: 'Mail app should open. If nothing happens, email directly: ',
      tooLong: 'Message was too long for a mail link, so full text was copied to clipboard. Please email: ',
    },

    footer: {
      copy: `© ${site.year} ${site.handle}`,
    },
  },
};
