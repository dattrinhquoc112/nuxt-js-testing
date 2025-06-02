import { type H3Event, setCookie } from 'h3';
import {
  convertCookieObjectToString,
  parseSetCookie,
} from '@/utils/cookieHelper';
import audioRequestHelper from '~/utils/audioRequestHelper';
import { MethodEnum } from '~/stores/interface/api';
import requestFetch from '@/utils/requestFetch';

export default defineEventHandler(async <ResponseDataType>(event: H3Event) => {
  const cookie = parseCookies(event);

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
      setCookie(event, newCookie.name, newCookie.value, newCookie.options);
    }
  }

  const payload = await readBody(event);
  const headers = {
    ...payload.headers,
  };
  if (cookie) {
    headers.Cookie = convertCookieObjectToString({
      platform_auth_session: cookieAuthSession,
    });
  }
  const response = await audioRequestHelper<ResponseDataType>({
    ...payload,
    headers,
  });
  return response;
});
