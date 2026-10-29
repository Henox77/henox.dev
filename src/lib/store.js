export function createEmitter({ onFirst, onLast } = {}) {
  const listeners = new Set();
  return {
    emit: () => listeners.forEach((l) => l()),
    subscribe(cb) {
      listeners.add(cb);
      if (listeners.size === 1) onFirst?.();
      return () => {
        listeners.delete(cb);
        if (!listeners.size) onLast?.();
      };
    },
  };
}
