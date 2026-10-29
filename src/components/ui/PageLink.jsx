import { pathOf } from '../../lib/paths.js';
import { isPlainClick } from '../../lib/dom.js';

export default function PageLink({ view, onNavigate, className = 'hero-link', children, ...rest }) {
  return (
    <a
      href={pathOf(view)}
      className={className}
      onClick={(e) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        onNavigate?.(view);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
