import { type H3Event } from 'h3';
import requestHelper from '@/utils/requestHelper';
import type { IOauthToken } from '@/stores/interface/response/auth';
import {
  setPlatformAuthCookieOnServer,
  convertCookieObjectToString,
} from '@/utils/cookieHelper';
import { KEY_LOCAL_STORAGE } from '@/utils/constants';

export default defineEventHandler(async (event: H3Event) => {
  const cookie = parseCookies(event);
  const payload = await readBody(event);

  const headers = {
    ...payload.headers,
  };
  if (cookie) {
    headers.Cookie = convertCookieObjectToString(cookie);
  }
  const response: IOauthToken = await requestHelper({
    ...payload,
    headers,
    endpoint: '/api/v1/oauth2/switch-tenant',
  });

  setPlatformAuthCookieOnServer(
    response,
    event,
    KEY_LOCAL_STORAGE.TOKEN_TENANT
  );

  return response;
});
