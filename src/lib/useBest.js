import { useCallback, useState } from 'react';
import { readBest, saveBest } from './storage.js';
import { checkSkinUnlocks } from './skin.js';

export default function useBest(key, { lowerIsBetter = false } = {}) {
  const [best, setBest] = useState(() => readBest(key));
  const [newBest, setNewBest] = useState(false);
  const record = useCallback(
    (n) => {
      const beats = lowerIsBetter ? !best || n < best : n > best;
      if (!beats) return;
      setBest(n);
      saveBest(key, n);
      checkSkinUnlocks();
      setNewBest(true);
    },
    [best, key, lowerIsBetter]
  );
  const clearNew = useCallback(() => setNewBest(false), []);
  return { best, newBest, record, clearNew };
}
