import { useEffect, useRef, useState } from 'react';
import { onSkinToast } from '../../../lib/skin.js';

const SHOW_MS = 7000;

export default function SkinToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(0);

  useEffect(() => {
    const off = onSkinToast((t) => {
      setToast(t);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(null), SHOW_MS);
    });
    return () => {
      off();
      window.clearTimeout(timer.current);
    };
  }, []);

  if (!toast) return null;
  const close = () => setToast(null);
  return (
    <div className="skin-toast" role="status" aria-live="polite">
      <span>{toast.text}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action.run();
            close();
          }}
          className="skin-toast-act"
        >
          {toast.action.label}
        </button>
      )}
      <button type="button" onClick={close} className="skin-toast-x" aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
