let idVersion: string = '';

export const triggerChangeStorage = () => {
  idVersion = new Date().getTime().toString();
  const domain = getOriginDomain(window.location.host);
  setCookie(KEY_LOCAL_STORAGE.VERSION_CHANGE, idVersion, {
    domain: domain !== 'localhost' ? `.${domain}` : undefined,
  });
};

export const getChangeStorage = () => {
  const newIdVersion = getCookie(KEY_LOCAL_STORAGE.VERSION_CHANGE);
  if (idVersion === '') {
    idVersion = newIdVersion;
    return false;
  }
  if (newIdVersion !== idVersion) {
    idVersion = newIdVersion;
    return true;
  }
  return false;
};

export default null;
