import SectionHead from '../ui/SectionHead.jsx';
import Socials from './Socials/Socials.jsx';
import { SECTION_ANCHOR, WRAP } from '../../config/ui.js';
import { CONTACT } from '../../config/pages.js';

export default function Contact() {
  return (
    <section id={CONTACT.id} className={SECTION_ANCHOR}>
      <div className={WRAP}>
        <SectionHead num="04" title={CONTACT.label} />
        <div className="max-w-[540px] mx-auto py-8">
          <Socials />
        </div>
      </div>
    </section>
  );
}
