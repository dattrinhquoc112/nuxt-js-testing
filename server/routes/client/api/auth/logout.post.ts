import { parseCookies, deleteCookie, setCookie } from 'h3';
import {
  getOriginDomain,
  convertCookieObjectToString,
} from '@/utils/cookieHelper';
import requestHelper from '@/utils/requestHelper';
import { MethodEnum } from '~/stores/interface/api';

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);

  const listCookieSetNull = [
    'platform_session_refresh',
    'platform_auth_session',
  ];
  const host = event.node.req.headers.host || '';
  const domain = getOriginDomain(host);

  Object.keys(cookies).forEach((name) => {
    if (listCookieSetNull.includes(name)) {
      setCookie(event, name, '', {
        domain: domain !== 'localhost' ? `.${domain}` : undefined,
      });
    } else {
      deleteCookie(event, name);
    }
  });

  const response = await requestHelper({
    endpoint: '/api/v1/oauth2/revoke',
    method: MethodEnum.POST,
    headers: {
      Cookie: convertCookieObjectToString({
        platform_auth_session: cookies.platform_auth_session,
        platform_session_refresh: cookies.platform_session_refresh,
      }),
    },
  });

  return response;
});
