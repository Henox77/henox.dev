import { useEffect, useRef, useState } from 'react';
import Btn31 from '../ui/Btn31/Btn31.jsx';
import ContactButton from './ContactButton/ContactButton.jsx';
import SheetCard from './SheetCard.jsx';
import { scrollToAnchor } from '../../lib/dom.js';
import useSkin from '../../lib/useSkin.js';
import HeroLetters from './HeroLetters.jsx';
import { isPaused, onPauseChange } from '../../lib/nap.js';
import { prefersReducedMotion, sleep } from '../../lib/env.js';
import { observeVisible } from '../../lib/observe.js';
import { site } from '../../config/site.js';
import { WRAP } from '../../config/ui.js';
import { CONTACT } from '../../config/pages.js';
import { useLang } from '../../context/LangContext.jsx';
import HlArrow from '../ui/HlArrow.jsx';
import Scramble from '../ui/Scramble.jsx';

function Typewriter({ phrases }) {
  const [text, setText] = useState(phrases[0] || '');
  const cursor = useRef(null);
  const phrasesRef = useRef(phrases);
  phrasesRef.current = phrases;

  useEffect(() => {
    setText(phrases[0] || '');
  }, [phrases]);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let dead = false;
    let visible = true;
    const waiters = [];
    const idle = () => !visible || isPaused();
    const wakeUp = () => {
      if (!idle()) waiters.splice(0).forEach((resolve) => resolve());
    };
    const offVisible = observeVisible(cursor.current, (v) => {
      visible = v;
      wakeUp();
    });
    const offPause = onPauseChange(wakeUp);
    const rest = () => (idle() && !dead ? new Promise((resolve) => waiters.push(resolve)) : Promise.resolve());
    (async () => {
      let i = 0;
      await sleep(2800);
      while (!dead) {
        await rest();
        if (dead) break;
        const currentPhrases = phrasesRef.current;
        const currentWord = currentPhrases[i % currentPhrases.length] || '';
        for (let n = currentWord.length - 1; n >= 0 && !dead; n--) {
          setText(currentWord.slice(0, n));
          await sleep(32);
        }
        i = (i + 1) % currentPhrases.length;
        await sleep(280);
        const nextWord = currentPhrases[i] || '';
        for (let n = 1; n <= nextWord.length && !dead; n++) {
          setText(nextWord.slice(0, n));
          await sleep(75);
        }
        await sleep(2600);
      }
    })();
    return () => {
      dead = true;
      offVisible();
      offPause();
      waiters.splice(0).forEach((resolve) => resolve());
    };
  }, []);

  return (
    <>
      {text}
      <span ref={cursor} className="term-cursor inline-block w-[0.5em] h-[0.8em] ml-2 align-baseline" />
    </>
  );
}

export default function Hero({ onNavigate }) {
  const { skin } = useSkin();
  const { dict } = useLang();
  const next = skin === 'retro-os' ? '#featured' : '#terminal';
  const [toys, setToys] = useState(null);

  const heroPhrases = dict.hero.phrases || site.content.phrases;

  return (
    <header className="hero-full">
      <div className={`${WRAP} relative z-[1] w-full pt-10 pb-24`}>
        <h1 className="hero-title" aria-label={`${dict.hero.ariaLabel} ${heroPhrases[0]}`}>
          <span aria-hidden="true">
            {dict.hero.hi}{' '}
            <span className="text-amber henox-glow">
              {[...site.name].map((ch, n) => (
                <span key={n} className="henox-letter">
                  {ch}
                </span>
              ))}
            </span>
            .<br />
            <Typewriter phrases={heroPhrases} />
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr] gap-10 md:gap-14 mt-9 items-start">
          <div>
            <p className="text-ink text-lg leading-relaxed max-w-[440px]">
              {dict.hero.intro}
            </p>
            <p className="font-mono text-[13px] text-dim mt-4">{dict.hero.note}</p>
            <div className="flex gap-3.5 mt-8 flex-wrap items-center" data-solid-kids>
              <Btn31 onClick={() => scrollToAnchor('#featured')}>{dict.hero.viewProjects}</Btn31>
              <ContactButton href={CONTACT.href} />
            </div>
            <div ref={setToys} className="mt-10" />
          </div>
          <div data-solid>
            <SheetCard />
          </div>
        </div>
      </div>

      <div className={`absolute z-[1] inset-x-0 bottom-0 ${WRAP} w-full pb-8 flex items-end justify-between`}>
        <a
          href={next}
          data-solid
          className="hero-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToAnchor(next);
          }}
        >
          <Scramble>{dict.hero.scrollToContinue}</Scramble> <HlArrow dir="down" />
        </a>
        <a
          href="#projects"
          data-solid
          className="hero-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.('projects');
          }}
        >
          <Scramble>{dict.hero.projectsLink}</Scramble> <HlArrow dir="ne" />
        </a>
      </div>

      <HeroLetters slot={toys} />
    </header>
  );
}
