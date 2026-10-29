export const isPlainClick = (e) => e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);

export const isTypingTarget = (t) =>
  !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);

export const isSlashShortcut = (e) => e.key === '/' && !(e.altKey || e.ctrlKey || e.metaKey) && !isTypingTarget(e.target);

export const scrollToAnchor = (href) => document.querySelector(href)?.scrollIntoView({ block: 'start' });

export const spotMove = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};
