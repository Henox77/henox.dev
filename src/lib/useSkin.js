import { useSyncExternalStore } from 'react';
import { getChoice, getSkin, getSkinSnapshot, subscribeSkin } from './skin.js';

export default function useSkin() {
  useSyncExternalStore(subscribeSkin, getSkinSnapshot);
  return { choice: getChoice(), skin: getSkin(), theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark' };
}
