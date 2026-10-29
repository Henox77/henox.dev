# ⚡ henox.dev

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/henox.dev-portfolio-amber?style=for-the-badge&logo=codeforces&logoColor=black)
[![Domain](https://img.shields.io/badge/Domain-henox.dev-blue.svg?style=for-the-badge&logo=google-chrome&logoColor=white)](https://henox.dev/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Bilingual](https://img.shields.io/badge/Language-TR%20%7C%20EN-orange?style=for-the-badge)](#-dil-desteği--language-support)

<br/>

> *"Modern web apps, retro terminal aesthetics, clean code and playful interactive experiences."*

**🌐 Canlı Site / Live Demo:** **[https://henox.dev/](https://henox.dev/)**  
**📁 GitHub Repository:** **[https://github.com/Henox77/henox.dev](https://github.com/Henox77/henox.dev)**

---

### [🇹🇷 Türkçe Açıklama](#-türkçe-açıklama) • [🇬🇧 English Description](#-english-description)

</div>

---

## 🇹🇷 Türkçe Açıklama

### ✨ Proje Hakkında
**henox.dev**, modern frontend teknolojileri (React 19, Tailwind CSS v4, Vite) ile retro terminal ve kod editörü estetiğini harmanlayan, doğrudan **[henox.dev](https://henox.dev/)** alan adı üzerinde çalışan kişisel portfolyo ve interaktif deneyim platformudur.

Sayfa yalnızca statik bir tanıtım sitesi değil, yaşayan bir terminal simülasyonudur:
- **Dosya Görünümlü Sekmeler:** `about.js`, `log.sh`, `projects/`, `lab.css`, `contact.sh`.
- **Etkileşimli Terminal:** Sayfada çalışan gerçek bir bash terminali (`whoami`, `cat`, `cd`, `theme`, `battery`, `sudo hire henox`).
- **Fizik Tabanlı Eğlence:** `henox.dev` harfleri ve kod tokenları Matter.js fizik motoruyla butonların ve kartların üzerine düşer, sürüklenebilir ve fırlatılabilir.
- **Dinamik Dil Desteği:** Navbar üzerindeki dil seçici ile anında **Türkçe (TR)** ve **İngilizce (EN)** arasında geçiş.
- **Özel Footer & Avatar:** Sayfanın altında parlayan avatar rozetiyle `henox.png` ve canlı durum göstergesi.
- **Gelişmiş Tema / Skin Motoru:** Ctrl+K ile açılan palet üzerinden CRT, Cyberpunk, Nord, Dracula, Gruvbox, Game Boy ve gizli temalar dahil onlarca skin seçeneği.

### 🎮 Öne Çıkan Özellikler

| Özellik | Açıklama |
|---|---|
| **🌐 Çift Dil (TR / EN)** | Tek tıklamayla tüm içerik (hero, biyografi, yaşam günlüğü, projeler, lab, terminal ve iletişim formu) Türkçe ve İngilizce arasında pürüzsüzce çevrilir. |
| **🕹️ henox.sav Kartı** | Durum bildirimi (`auto`, `busy`, `focus`, `offline`), sosyal batarya seviyesi, etkileşimli `$ merhaba de` yanıtları ve Konami koduyla açılan tam kişilik modu. |
| **🧪 Laboratuvar (`lab.css`)** | BugSquash, Snake, MemoryMatch, Ghost, CreatureStage gibi tamamen tarayıcıda çalışan mini oyunlar ve görsel oyuncaklar. |
| **💾 Kaset Rafı (`projects/`)** | Projeleri retro konsol kaseti veya dosya listesi (`ls`) biçiminde inceleme, canlı kod çıktısı (`Readout`) ve GitHub bağlantıları. |
| **🎨 15+ Tema & Skin** | JetBrains Mono, Silkscreen, VT323 fontları ve temaya göre değişen CRT tarama çizgileri, neon parlama efektleri. |
| **⚡ Özel Domain & Sıfır Maliyet** | `henox.dev` alan adına tam uyumlu root routing (`/`), CNAME entegrasyonu ve sunucusuz mimari. |

### 🚀 Hızlı Başlangıç

Projeyi yerel ortamınızda çalıştırmak için:

```bash
# Depoyu klonlayın
git clone https://github.com/Henox77/henox.dev.git
cd henox.dev

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173/` adresine gidin.

### 📦 Derleme ve Yayınlama (Build & Deploy)

```bash
# Üretim derlemesi (Production build)
npm run build

# Yerel ortamda derlemeyi önizleme
npm run preview
```

---

## 🇬🇧 English Description

### ✨ About The Site
**henox.dev** is the personal portfolio of **Henox**, deployed directly on **[https://henox.dev/](https://henox.dev/)**, built with React 19, Tailwind CSS v4, and Vite, featuring a distinctive code-editor and retro terminal aesthetic.

The entire website behaves like a playful terminal system:
- **Files as Navigation:** Section titles correspond to real files (`about.js`, `log.sh`, `projects/`, `lab.css`, `contact.sh`).
- **Interactive Terminal:** An in-browser terminal emulator supporting commands like `whoami`, `ls`, `cat mood.txt`, `theme random`, `battery`, and `sudo hire henox`.
- **Physics Playground:** Letters from `henox.dev` drop and bounce on UI elements using Matter.js 2D physics.
- **Bilingual Experience:** Seamless instant toggle between **English** and **Turkish**.
- **Custom Footer & Avatar:** Features `henox.png` avatar badge with ambient glow and real-time online status.
- **Skin System:** Switch between dozens of skins (Dracula, Nord, Cyberpunk, CRT Amber, Retro OS, Game Boy, Matrix) via **Ctrl+K**.

### 🌟 Key Highlights

- **Custom Domain Ready:** Configured for root deployment at `https://henox.dev/` with automated CNAME generation.
- **Bilingual (TR & EN):** Seamless localization managed via lightweight React context with automatic browser language detection and `localStorage` persistence.
- **Interactive Sheet (`henox.sav`):** Displays real-time social battery, status indicators, `$ say hi` responses, and Easter eggs (Konami code).
- **Arcade Lab (`lab.css`):** Built-in mini-games such as Snake, Memory Match, Bug Squash, and interactive SVG audio/visualizers.
- **Cartridge Console (`projects/`):** View projects as retro gaming cartridges or unix file listings with automated live deployment checks via GitHub API.

---

## 📂 Project Structure / Proje Mimarisi

```
henox.dev/
├── henox.png                  # Avatar image
├── public/
│   ├── CNAME                  # Custom domain configuration (henox.dev)
│   ├── henox.png              # Public asset for footer & metadata
│   └── favicon.svg            # Site icon
├── index.html                 # Token-injected HTML shell
├── package.json               # Scripts & dependencies
├── src/
│   ├── App.jsx                # Main application orchestrator & routing
│   ├── config/
│   │   ├── site.js            # Central identity: henox.dev, bio, links, repo config
│   │   ├── pages.js           # Page registry & tab titles
│   │   └── skins.js           # Skin definitions & palette tokens
│   ├── context/
│   │   └── LangContext.jsx    # Language provider (TR/EN) & translation hook
│   ├── lib/
│   │   ├── i18n.js            # Bilingual dictionaries & helper functions
│   │   ├── skin.js            # Skin state manager & canvas synchronization
│   │   └── social.js          # Social battery, interactive replies & Easter eggs
│   ├── components/
│   │   ├── home/              # Hero, SheetCard, Terminal, Contact & Feedback
│   │   ├── about/             # CodeWindow (about.js), Git Graph (log.sh), Skills
│   │   ├── lab/               # Interactive games & stage components
│   │   └── layout/            # Navbar, LangToggle, Preloader, Skins, Signature & Footer
│   └── projects/              # Cartridge console & individual project metas
└── system/                    # Build configuration, ESLint & SPA scripts
```

---

## 📬 Contact & Socials / İletişim

- **Live Site:** [https://henox.dev/](https://henox.dev/)
- **GitHub:** [@Henox77](https://github.com/Henox77)
- **Repository:** [https://github.com/Henox77/henox.dev](https://github.com/Henox77/henox.dev)
- **Email:** [contact@henox.dev](mailto:contact@henox.dev)
