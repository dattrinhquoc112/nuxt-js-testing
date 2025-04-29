import CryptoJS from 'crypto-js';

export const decodeBase64 = (value: string): CryptoJS.lib.WordArray =>
  CryptoJS.enc.Base64.parse(value);

export const encryptWithCBC = (
  message: object,
  key: CryptoJS.lib.WordArray,
  iv: CryptoJS.lib.WordArray
): string =>
  CryptoJS.AES.encrypt(JSON.stringify(message), key.toString(), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

export const decryptWithCBC = (
  token: string,
  key: CryptoJS.lib.WordArray,
  iv: CryptoJS.lib.WordArray
) =>
  CryptoJS.AES.decrypt(token, key.toString(), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

export default null;
