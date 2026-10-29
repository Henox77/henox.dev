import { useSyncExternalStore } from 'react';
import { isOnlineHour } from './siteTime.js';
import { storageGet, storageSet } from './storage.js';
import { storageKey } from '../config/site.js';
import { createEmitter } from './store.js';
import { pausableInterval } from './timers.js';

const STATUS_CONFIG = {
  online: { label: 'online', blurb: 'open to new projects', color: 'var(--green)', pulse: true },
  offline: { label: 'offline', blurb: 'offline right now, will reply later', color: 'var(--text-dim)', pulse: false },
  busy: { label: 'busy - replies may be slow', blurb: 'busy, replies may be slow', color: 'var(--amber)', pulse: false },
  focus: { label: 'in focus mode', blurb: 'in focus mode, replies may be slow', color: 'var(--css-lang)', pulse: false },
};

const CYCLE = ['auto', 'busy', 'focus', 'offline'];
const STORAGE_KEY = storageKey('status-override');

const autoStatus = () => (isOnlineHour() ? 'online' : 'offline');

function readOverride() {
  const v = storageGet(STORAGE_KEY);
  return CYCLE.includes(v) ? v : 'auto';
}

let override = readOverride();
let stopClock = null;

const current = () => (override === 'auto' ? autoStatus() : override);
export const getStatusKey = current;
const snapshot = () => `${override}:${current()}`;

const { subscribe, emit } = createEmitter({
  onFirst: () => (stopClock = pausableInterval(() => emit(), 60 * 1000)),
  onLast: () => {
    stopClock?.();
    stopClock = null;
  },
});

export function cycleStatus() {
  override = CYCLE[(CYCLE.indexOf(override) + 1) % CYCLE.length];
  storageSet(STORAGE_KEY, override === 'auto' ? null : override);
  emit();
}

export function useStatus() {
  const [mode, key] = useSyncExternalStore(subscribe, snapshot).split(':');
  return { key, isAuto: mode === 'auto', ...STATUS_CONFIG[key] };
}
