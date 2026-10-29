import { useCallback, useState } from 'react';
import useBest from '../../../lib/useBest.js';

export default function useGameRound(bestKey, bestOptions) {
  const [status, setStatus] = useState('idle');
  const [round, setRound] = useState(0);
  const { best, newBest, record, clearNew } = useBest(bestKey, bestOptions);

  const begin = useCallback(() => {
    clearNew();
    setStatus('playing');
    setRound((r) => r + 1);
  }, [clearNew]);

  const finish = useCallback(
    (score) => {
      record(score);
      setStatus('over');
    },
    [record]
  );

  return { status, round, best, newBest, begin, finish };
}
