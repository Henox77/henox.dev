const subs = new Set();

export const emitReaction = (name, detail) => {
  subs.forEach((fn) => {
    try {
      fn(name, detail);
    } catch {
    }
  });
};

export const onReaction = (fn) => {
  subs.add(fn);
  return () => subs.delete(fn);
};
