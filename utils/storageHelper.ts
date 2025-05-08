const setStorage = (key: string, value: any | null) => {
  if (value === null) return;
  if (typeof value === 'object') {
    window.localStorage.setItem(key, JSON.stringify(value));
  } else {
    window.localStorage.setItem(key, value);
  }
};
const getStorage = (key: string) => {
  const data = window.localStorage.getItem(key);
  if (typeof data === 'object' && data !== null) {
    return JSON.parse(data);
  }
  return data;
};

const deleteStorage = (key: string) => window.localStorage.removeItem(key);

const setSession = (key: string, value: string | number) => {
  window.sessionStorage.setItem(key, value.toString());
};

const getSession = (key: string) => window.sessionStorage.getItem(key) || '';

const deleteSession = (key: string) => window.sessionStorage.removeItem(key);

export {
  setStorage,
  getStorage,
  deleteStorage,
  setSession,
  getSession,
  deleteSession,
};
