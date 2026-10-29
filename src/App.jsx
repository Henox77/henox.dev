import { Suspense, useEffect, useRef, useState } from 'react';
import Preloader from './components/layout/Preloader/Preloader.jsx';
import ErrorBoundary from './components/layout/ErrorBoundary.jsx';
import Loader from './components/layout/Loader/Loader.jsx';
import Navbar from './components/layout/Navbar/Navbar.jsx';
import Hero from './components/home/Hero.jsx';
import { FeaturedProjects, AboutTeaser, LabTeaser, TerminalSection } from './components/home/HomeSections.jsx';
import Contact from './components/home/Contact.jsx';
import { Signature, Footer } from './components/layout/Signature/Signature.jsx';
import { emitReaction } from './lib/reactions.js';
import { startShakeWatch } from './lib/shake.js';
import Ambient from './components/layout/Ambient/Ambient.jsx';
import BackToTop from './components/layout/BackToTop/BackToTop.jsx';
import Alive from './components/layout/Alive/Alive.jsx';
import { pageOfView, titleOf, topOf, viewFromLocation } from './config/pages.js';
import { pathOf } from './lib/paths.js';
import { storageSet } from './lib/storage.js';
import { storageKey } from './config/site.js';
import { canHover, prefersReducedMotion } from './lib/env.js';
import { timeOfDay } from './lib/siteTime.js';
import { pausableInterval } from './lib/timers.js';
import { syncThemeColor, syncThemeNow } from './lib/themeSync.js';
import { forcedTheme, refreshAuto, rememberTheme, skinToast, subscribeSkin } from './lib/skin.js';
import { skinById } from './config/skins.js';
import SkinFx from './components/layout/Skin/SkinFx.jsx';
import Cameo from './components/layout/Cameo/Cameo.jsx';
import SkinPalette from './components/layout/Skin/SkinPalette.jsx';
import SkinToast from './components/layout/Skin/SkinToast.jsx';
import { useLang } from './context/LangContext.jsx';

const TAB_LOADER_MS = 450;

export default function App() {
  const { lang } = useLang();
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [view, setView] = useState(viewFromLocation);
  const [pendingScroll, setPendingScroll] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const savedHomeScroll = useRef(0);
  const navTimer = useRef(0);
  const glowRef = useRef(null);
  const themeTimer = useRef(0);
  const mainRef = useRef(null);
  const firstView = useRef(true);
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => startShakeWatch(), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    syncThemeColor();

    if (!forcedTheme()) {
      rememberTheme(theme);
      storageSet(storageKey('theme'), theme);
    }
  }, [theme]);

  useEffect(
    () =>
      subscribeSkin(() => setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')),
    []
  );

  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      setPaletteOpen((o) => !o);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (view !== 'home' || pendingScroll == null) return;
    if (typeof pendingScroll === 'string') {
      const el = document.querySelector(pendingScroll);
      if (el) el.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo({ top: pendingScroll, behavior: 'instant' });
    }
    setPendingScroll(null);
  }, [view, pendingScroll]);

  useEffect(() => {
    document.title = titleOf(view);

    if (firstView.current) firstView.current = false;
    else mainRef.current?.focus({ preventScroll: true });
  }, [view, lang]);

  useEffect(() => {
    const id = location.hash.replace(/^#/, '');
    if (!id || viewFromLocation() !== 'home') return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
      history.replaceState(null, '', pathOf('home'));
    }, 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    history.scrollRestoration = 'manual';

    const canonical = pathOf(viewFromLocation());
    if (location.pathname.replace(/\/+$/, '') !== canonical.replace(/\/+$/, '')) {
      history.replaceState(null, '', canonical + location.hash);
    }
    const onPop = () => goTo(viewFromLocation(), undefined, false);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.clearTimeout(navTimer.current);
    };
  }, []);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || !canHover()) return;
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.setProperty('--mx', e.clientX + 'px');
        glow.style.setProperty('--my', e.clientY + 'px');
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  useEffect(() => {
    const apply = () => {
      const root = document.documentElement;
      const next = timeOfDay();
      if (root.dataset.tod === next) return;
      swapColors(() => {
        root.dataset.tod = next;
      });
      refreshAuto();
    };
    apply();
    return pausableInterval(apply, 60 * 1000);
  }, []);

  const swapColors = (change) => {
    const root = document.documentElement;
    window.clearTimeout(themeTimer.current);
    root.classList.add('theme-anim');
    change();
    syncThemeNow();
    syncThemeColor();
    themeTimer.current = window.setTimeout(() => root.classList.remove('theme-anim'), 120);
  };
  const toggleTheme = () => {
    const locked = forcedTheme();
    if (locked) {

      skinToast({ text: `${skinById(document.documentElement.dataset.skin)?.label} is ${locked}-only. open skins (Ctrl+K) for one with both.` });
      return;
    }
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    swapColors(() => {
      document.documentElement.dataset.theme = next;
    });
    setTheme(next);
    emitReaction('theme', next);
  };

  const goTo = (nextView, scrollTarget, push = true) => {
    const pending = navTimer.current;
    window.clearTimeout(pending);
    navTimer.current = 0;
    if (nextView === viewRef.current) {
      if (pending) setIsLoading(false);
      return;
    }

    const sameTab = nextView !== 'home' && viewRef.current !== 'home' && topOf(nextView) === topOf(viewRef.current);
    if (!sameTab && !prefersReducedMotion()) setIsLoading(true);

    const preloaded = pageOfView(nextView)?.preload?.().catch(() => {});
    const swap = () => {
      navTimer.current = 0;
      if (viewRef.current === 'home' && nextView !== 'home') {
        savedHomeScroll.current = window.scrollY;
      }
      if (push) {

        history.pushState({ from: viewRef.current }, '', pathOf(nextView));
      }
      setView(nextView);
      emitReaction('navigate', nextView);
      if (nextView === 'home') {
        setPendingScroll(scrollTarget ?? savedHomeScroll.current);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      setIsLoading(false);
    };
    const wait = sameTab || prefersReducedMotion() ? 0 : TAB_LOADER_MS;
    const id = window.setTimeout(() => {

      if (navTimer.current !== id) return;
      if (!preloaded) return swap();
      preloaded.then(() => {
        if (navTimer.current === id) swap();
      });
    }, wait);
    navTimer.current = id;
  };
  const handleNavigate = (nextView, scrollTarget) => goTo(nextView, scrollTarget, true);

  const page = pageOfView(view);

  return (
    <>
      <SkinFx />
      <Cameo view={view} onNavigate={handleNavigate} onToggleTheme={toggleTheme} onOpenSkins={() => setPaletteOpen(true)} />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <Preloader />
      <Loader show={isLoading} />
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:rounded-md focus:bg-panel focus:text-ink focus:border focus:border-amber font-mono text-[13px]">
        skip to content
      </a>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSkins={() => setPaletteOpen(true)}
        view={view}
        onNavigate={handleNavigate}
      />

      <main id="main" ref={mainRef} tabIndex={-1} className="outline-hidden">
      <ErrorBoundary key={view} inline>
      {page ? (
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <page.Component view={view} onNavigate={handleNavigate} />
        </Suspense>
      ) : (
        <>
          <Hero onNavigate={handleNavigate} />
          <TerminalSection onNavigate={handleNavigate} />
          <FeaturedProjects onNavigate={handleNavigate} />
          <AboutTeaser onNavigate={handleNavigate} />
          <LabTeaser onNavigate={handleNavigate} />
          <Contact />
        </>
      )}
      </ErrorBoundary>
      </main>

      <Signature />
      <Footer />
      <Ambient />
      <BackToTop />
      <Alive />
      <SkinPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <SkinToast />
    </>
  );
}
