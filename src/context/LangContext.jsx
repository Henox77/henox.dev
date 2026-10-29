import { createContext, useContext, useEffect, useState } from 'react';
import { DICTIONARY, getInitialLang, LANG_STORAGE_KEY } from '../lib/i18n.js';

const LangContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: () => '',
  dict: DICTIONARY.en,
});

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = (nextLang) => {
    const l = nextLang === 'tr' ? 'tr' : 'en';
    setLangState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {}
    document.documentElement.lang = l;
  };

  const toggleLang = () => {
    setLang(lang === 'tr' ? 'en' : 'tr');
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const dict = DICTIONARY[lang] || DICTIONARY.en;

  const t = (path, fallback = '') => {
    const parts = path.split('.');
    let cur = dict;
    for (const part of parts) {
      if (cur && typeof cur === 'object' && part in cur) {
        cur = cur[part];
      } else {
        return fallback || path;
      }
    }
    return cur ?? fallback ?? path;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t, dict }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

