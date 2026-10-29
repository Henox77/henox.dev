
export function observeOnce(els, onEnter, threshold = 0.4) {
  const list = (Array.isArray(els) || els instanceof NodeList ? [...els] : [els]).filter(Boolean);
  if (!list.length) return () => {};
  if (!('IntersectionObserver' in window)) {
    list.forEach(onEnter);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        onEnter(en.target);
      }),
    { threshold }
  );
  list.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

export function observeVisible(el, onChange) {
  const io = new IntersectionObserver(([en]) => onChange(en.isIntersecting));
  io.observe(el);
  return () => io.disconnect();
}
