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

  }
  return 'en';
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
        'Tutkuyla kod yazıyorum.',
        'Modern web uygulamaları geliştiriyorum.',
        'Gece yarısı buglarını avlıyorum.',
        'CSS ve yaratıcı kodlamayla oynuyorum.',
        'Full-stack çözümler üretiyorum.',
      ],
      intro: 'Modern web teknolojileri, interaktif arayüzler ve performanslı full-stack çözümler geliştirmeyi seviyorum.',
      note: 'varsayılan olarak odaklanmış. yine de bir merhaba de →',
      viewProjects: 'projeleri incele',
      contactMe: 'iletişime geç',
      scrollToContinue: 'Devam etmek için kaydır',
      projectsLink: 'Projeler',
    },

    card: {
      statusAuto: '· oto',
      classTitle: 'Rolü değiştirmek için tıkla',
      classes: ['Yazılım Geliştirici', 'Hata Avcısı', 'Arayüz Büyücüsü', 'Kahve Tutkunu', 'Gece Kodlayıcısı (lvl 99)'],
      location: 'konum',
      mainQuest: 'ana görev',
      sideQuest: 'yan görev',
      socialBattery: 'sosyal batarya',
      personality: 'karakter kilidi',
      personalityHint: '6+ aylık arkadaşlık gerektirir',
      sayHi: '$ merhaba de',
      sayHiReplies: [
        'merhaba! sayfama hoş geldin :)',
        'selam! projeleri kurcalamaktan çekinme.',
        'hey! bugün kodlar tertemiz akıyor.',
        'merhaba yabancı. kahveni aldın mı?',
        'bataryam azalıyor ama sana her zaman vaktim var!',
        'birlikte harika şeyler inşa edelim.',
      ],
      sleepingNote: 'zzz... batarya tükendi',
    },

    terminal: {
      promptNote: 'bir komut yazın veya aşağıdaki hazır sorulardan birine tıklayın',
      whoami: `${site.id} - ${site.role.toLowerCase()}, ${site.location}`,
      mood: 'odaklanmış, meraklı, temiz ve eğlenceli projeler üreten.',
      teaLine: 'kahve && çay. üretkenliğin yakıtı.',
      quick: [
        ['kimsin sen?', 'whoami'],
        ['modun nasıl?', 'cat mood.txt'],
        ['neler kullanıyorsun?', 'cat stack.txt'],
        ['projeleri göster', 'cd projects'],
        ['seninle çalışabilir miyim?', `sudo hire ${site.id}`],
        ['beni şaşırt', 'theme random'],
      ],
      help: `help | ls | cat <dosya> | cd <sayfa> | whoami | date | battery | theme | clear`,
      helpHint: `dene: sudo hire ${site.id}, ya da theme list`,
      hireResp: `Harika! Birlikte çalışmak için iletişim formundan mesaj bırakabilir veya ${site.email} adresine yazabilirsin.`,
    },

    home: {
      featuredTitle: 'Öne Çıkan Projeler',
      allProjects: 'Tüm projeler',
      aboutTitle: 'Hakkımda',
      moreAboutMe: 'Hakkımda daha fazlası',
      labTitle: 'Laboratuvar',
      labDesc: 'Sırf nasıl çalıştığını görmek için yaptığım küçük oyunlar ve deneysel oyuncaklar.',
      openLab: 'Laboratuvarı aç',
    },

    about: {
      subtitle: 'hakkımda birkaç detay',
      yearsCoding: 'yıldır kodluyor',
      commitsLife: 'hayat günlüğünde kayıt',
      toolsStack: 'kullanılan teknoloji & araç',
      readmeTitle: 'beni-oku.md',
      readmeContent: `${startYear}'den beri tutkuyla kodluyorum. En sevdiğim teknoloji yığını ${mainStack} ve şu sıralar ${learning} üzerine odaklanıyorum. Hızlı, interaktif ve modern web deneyimleri inşa etmeyi seviyorum.`,
      logTitle: 'günlük.sh',
      skillsTitle: 'yetenekler.js',
      funFact: 'Gece yarılarına kadar kod yazıp asla sıkılmamak',
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
      shelfView: 'kaset görünümü',
      listView: 'liste görünümü',
      stars: 'yıldız',
    },

    lab: {
      subtitle: 'kurcalanacak deneysel şeyler: birini seç, sadece o çalışsın',
      matches: 'sonuç eşleşti',
      searchPlaceholder: 'ara…',
      random: 'Rastgele',
      backToGrid: '← Laboratuvara Dön',
    },

    contact: {
      subtitle: 'tek satırlık bir not bile yeter, hepsini okuyorum',
      placeholder: 'Bu sayfa veya projeler hakkında bir şeyler yazın...',
      send: 'Mesaj Gönder',
      copied: 'Kopyalandı!',
      copyEmail: 'E-postayı Kopyala',
      mailClientSuccess: 'E-posta uygulamanız açılmalı. Açılmazsa lütfen doğrudan e-posta atın: ',
      tooLong: 'Mesaj e-posta bağlantısı için uzundu, metin panonuza kopyalandı. Lütfen doğrudan yazın: ',
    },

    footer: {
      handcrafted: 'şablon değil, el emeği',
      copy: `${site.location}'da özenle geliştirildi · © ${site.year} ${site.id}`,
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
        'I code with passion.',
        'I craft modern web apps.',
        'I fix 3am bugs.',
        'I play with CSS & creative code.',
        'I build full-stack solutions.',
      ],
      intro: 'I love crafting clean web experiences, building playful interactive interfaces, and exploring new technologies.',
      note: 'focused by default. say hi anyway →',
      viewProjects: 'view projects',
      contactMe: 'contact me',
      scrollToContinue: 'Scroll to continue',
      projectsLink: 'Projects',
    },

    card: {
      statusAuto: '· auto',
      classTitle: 'Click to change class',
      classes: ['Software Developer', 'Bug Hunter', 'CSS Wizard', 'Coffee Lover', 'Night Owl (lvl 99)'],
      location: 'location',
      mainQuest: 'main quest',
      sideQuest: 'side quest',
      socialBattery: 'social battery',
      personality: 'personality unlocked',
      personalityHint: 'needs 6+ months of friendship',
      sayHi: '$ say hi',
      sayHiReplies: [
        'hi! thanks for stopping by :)',
        'hey there! feel free to poke around.',
        'hello! code is compiling cleanly today.',
        'hey stranger. grabbed your coffee yet?',
        'social battery dropping, but always got time for you!',
        "let's build something cool together.",
      ],
      sleepingNote: 'zzz... social battery: 0%',
    },

    terminal: {
      promptNote: 'type a command, or just click a question below',
      whoami: `${site.id} - ${site.role.toLowerCase()}, ${site.location}`,
      mood: 'chill, curious, shipping clean and playful stuff.',
      teaLine: 'coffee && tea. fuel for thought.',
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
      hireResp: `Awesome! Drop a note in contact.sh or shoot an email to ${site.email}.`,
    },

    home: {
      featuredTitle: 'Featured Projects',
      allProjects: 'All projects',
      aboutTitle: 'About Me',
      moreAboutMe: 'More about me',
      labTitle: 'Lab Experiments',
      labDesc: 'Tiny games and toys I build just to see if they work.',
      openLab: 'Open the lab',
    },

    about: {
      subtitle: 'a few things about me',
      yearsCoding: 'years coding',
      commitsLife: 'commits in life.log',
      toolsStack: 'tools in the stack',
      readmeTitle: 'readme.md',
      readmeContent: `Coding since ${startYear}. Favorite stack is ${mainStack}, and I'm currently exploring ${learning}. Focused on creating fast, interactive, and playful web applications.`,
      logTitle: 'log.sh',
      skillsTitle: 'skills.js',
      funFact: 'debugging CSS & React state machines until dawn without getting bored',
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
      shelfView: 'cartridge shelf',
      listView: 'directory listing',
      stars: 'stars',
    },

    lab: {
      subtitle: 'things to poke at: pick one, only that one runs',
      matches: 'match',
      searchPlaceholder: 'search…',
      random: 'Random',
      backToGrid: '← Back to Lab Grid',
    },

    contact: {
      subtitle: 'even a one-line note is fine, I read everything',
      placeholder: 'Write something about this page or projects...',
      send: 'Send Message',
      copied: 'Copied!',
      copyEmail: 'Copy Email',
      mailClientSuccess: 'Mail app should open. If nothing happens, email directly: ',
      tooLong: 'Message was too long for a mail link, so full text was copied to clipboard. Please email: ',
    },

    footer: {
      handcrafted: 'handcrafted, not templated',
      copy: `crafted with care in ${site.location} · © ${site.year} ${site.id}`,
    },
  },
};

