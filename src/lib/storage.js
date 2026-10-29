const safeStore = (getStore) => ({
  get(key) {
    try {
      return getStore().getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      if (value === null || value === undefined) getStore().removeItem(key);
      else getStore().setItem(key, String(value));
    } catch {
    }
  },
});

const local = safeStore(() => localStorage);
const session = safeStore(() => sessionStorage);

export const storageGet = local.get;
export const storageSet = local.set;

export const sessionGet = session.get;
export const sessionSet = session.set;

export const readBest = (key) => Number(storageGet(key)) || 0;
export const saveBest = (key, n) => storageSet(key, n);
