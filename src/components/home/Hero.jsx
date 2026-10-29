import { useState } from 'react';
import Btn31 from '../ui/Btn31/Btn31.jsx';
import ContactButton from './ContactButton/ContactButton.jsx';
import SheetCard from './SheetCard.jsx';
import { scrollToAnchor } from '../../lib/dom.js';
import useSkin from '../../lib/useSkin.js';
import HeroLetters from './HeroLetters.jsx';
import { site } from '../../config/site.js';
import { WRAP } from '../../config/ui.js';
import { CONTACT } from '../../config/pages.js';
import { useLang } from '../../context/LangContext.jsx';
import HlArrow from '../ui/HlArrow.jsx';
import Scramble from '../ui/Scramble.jsx';

export default function Hero({ onNavigate }) {
  const { skin } = useSkin();
  const { dict } = useLang();
  const next = skin === 'retro-os' ? '#featured' : '#terminal';
  const [toys, setToys] = useState(null);

  return (
    <header className="hero-full">
      <div className={`${WRAP} relative z-[1] w-full pt-10 pb-24`}>
        <h1 className="hero-title" aria-label={dict.hero.ariaLabel}>
          <span aria-hidden="true">
            {dict.hero.hi}{' '}
            <span className="text-amber henox-glow">
              {[...site.name].map((ch, n) => (
                <span key={n} className="henox-letter">
                  {ch}
                </span>
              ))}
            </span>
            .
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr] gap-10 md:gap-14 mt-9 items-start">
          <div>
            <div className="flex gap-3.5 mt-2 flex-wrap items-center" data-solid-kids>
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
