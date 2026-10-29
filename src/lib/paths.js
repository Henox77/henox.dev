export const BASE = import.meta.env.BASE_URL;
export const pathOf = (id) => (id === 'home' ? BASE : `${BASE}${id}`);
