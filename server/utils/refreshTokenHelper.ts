import { setCookie } from 'h3';
import { MethodEnum } from '~/stores/interface/api';
import requestFetch from '@/utils/requestFetch';
import {
  convertCookieObjectToString,
  parseSetCookie,
  getOriginDomain,
} from '@/utils/cookieHelper';
import jwtDecode from '@/utils/jwtDecode';
import { KEY_LOCAL_STORAGE } from '@/utils/constants';

export const refreshToken = async (
  cookie: Record<string, string>,
  event: any
) => {
  let cookieAuthSession = cookie.platform_auth_session;

  if (!cookieAuthSession && cookie.platform_session_refresh) {
    const responseToken = await requestFetch({
      method: MethodEnum.POST,
      endpoint: '/api/v1/oauth2/refresh-token',
      redirect: 'manual',
      headers: {
        Cookie: convertCookieObjectToString({
          platform_session_refresh: cookie.platform_session_refresh,
        }),
      },
    });

    const newHeaders = Object.fromEntries(responseToken.headers.entries());
    if (newHeaders['set-cookie']) {
      const newCookie = parseSetCookie(newHeaders['set-cookie']);
      cookieAuthSession = newCookie.value;

      const host = event.node.req.headers.host || '';
      const domain = getOriginDomain(host);

      setCookie(event, newCookie.name, cookieAuthSession, {
        ...newCookie.options,
        domain: domain !== 'localhost' ? `.${domain}` : undefined,
      });

      setCookie(
        event,
        KEY_LOCAL_STORAGE.INFO_USER,
        JSON.stringify(jwtDecode(cookieAuthSession)),
        {
          httpOnly: false,
          sameSite: 'strict',
          secure: true,
          path: '/',
          domain: domain !== 'localhost' ? `.${domain}` : undefined,
        }
      );
    }
  }

  return cookieAuthSession;
};
