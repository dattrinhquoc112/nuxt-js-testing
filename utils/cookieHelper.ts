import Cookies from 'js-cookie';
import { type H3Event, setCookie as setCookieH3 } from 'h3';
import type { IOauthToken } from '@/stores/interface/response/auth';

interface CookieAttributes {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

const setCookie = (
  key: string,
  value: string | number,
  attributes?: CookieAttributes
) => {
  Cookies.set(key, value.toString(), attributes);
};

const getCookie = (key: string) => Cookies.get(key) || '';

const deleteCookie = (key: string, attributes?: CookieAttributes) => {
  Cookies.remove(key, attributes);
};
function parseSetCookie(setCookieString: string) {
  const parts = setCookieString.split('; ');
  const [name, value] = parts[0].split('=');

  const options: any = {};

  for (let i = 1; i < parts.length; i++) {
    const [key, val] = parts[i].split('=');

    switch (key.toLowerCase()) {
      case 'httponly':
        options.httpOnly = true;
        break;
      case 'secure':
        options.secure = true;
        break;
      case 'samesite':
        options.sameSite = 'strict';
        break;
      case 'path':
        options.path = val;
        break;
      case 'max-age':
        options.maxAge = parseInt(val, 10);
        break;
      case 'expires':
        options.expires = new Date(val);
        break;
      default:
        break;
    }
  }

  return { name, value, options };
}
function convertCookieObjectToString(
  cookieObj: Record<string, string>
): string {
  return Object.entries(cookieObj)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}

function getDataFromCookie<T>(name: string): T | null {
  const cookies = document?.cookie
    .split('; ')
    .reduce<string | null>((acc, cookie) => {
      const [key, value] = cookie.split('=');
      return key === name ? value : acc;
    }, null);

  return cookies ? JSON.parse(decodeURIComponent(cookies)) : null;
}

function convertExpiresCookieToDate(second: number) {
  const now = new Date();
  return new Date(now.getTime() + second * 1000);
}

function getOriginDomain(host: string) {
  const domain = host.split(':')[0];
  return domain !== 'localhost'
    ? domain.split('.').slice(-2).join('.')
    : domain;
}

function setPlatformAuthCookieOnServer(
  response: IOauthToken,
  event: H3Event,
  typeTokenAuth: string
) {
  const host = event.node.req.headers.host || '';

  const domain = getOriginDomain(host);

  if (response?.refresh_token) {
    setCookieH3(event, 'platform_session_refresh', response.refresh_token, {
      path: '/',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      domain: domain !== 'localhost' ? `.${domain}` : undefined,
    });
  }
  if (response?.access_token) {
    setCookieH3(event, 'platform_auth_session', response.access_token, {
      path: '/',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      expires: convertExpiresCookieToDate(response.expires_in),
      domain: domain !== 'localhost' ? `.${domain}` : undefined,
    });

    setCookieH3(
      event,
      KEY_LOCAL_STORAGE.INFO_USER,
      JSON.stringify(jwtDecode(response.access_token)),
      {
        httpOnly: false,
        sameSite: 'strict',
        secure: true,
        path: '/',
        domain: domain !== 'localhost' ? `.${domain}` : undefined,
      }
    );
  }
  if (typeTokenAuth) {
    setCookieH3(event, KEY_LOCAL_STORAGE.IS_AUTHENTICATED, typeTokenAuth, {
      httpOnly: false,
      secure: true,
      path: '/',
    });
  }
}

export {
  setCookie,
  getCookie,
  deleteCookie,
  parseSetCookie,
  convertCookieObjectToString,
  convertExpiresCookieToDate,
  setPlatformAuthCookieOnServer,
  getDataFromCookie,
  getOriginDomain,
};
