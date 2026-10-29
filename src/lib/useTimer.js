import { useCallback, useEffect, useMemo, useRef } from 'react';

export default function useTimer() {
  const id = useRef(0);
  const clear = useCallback(() => {
    clearTimeout(id.current);
    id.current = 0;
  }, []);
  const set = useCallback((fn, ms) => {
    clearTimeout(id.current);
    id.current = window.setTimeout(fn, ms);
  }, []);
  useEffect(() => clear, [clear]);
  return useMemo(() => ({ set, clear }), [set, clear]);
}
