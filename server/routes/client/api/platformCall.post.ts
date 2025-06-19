import { type H3Event } from 'h3';
import { convertCookieObjectToString } from '@/utils/cookieHelper';
import platformRequestHelper from '~/utils/platformRequestHelper';
import { refreshToken } from '~/server/utils/refreshTokenHelper';

export default defineEventHandler(async <ResponseDataType>(event: H3Event) => {
  const cookie = parseCookies(event);

  const cookieAuthSession = await refreshToken(cookie, event);

  const payload = await readBody(event);
  const headers = {
    ...payload.headers,
  };

  if (cookie) {
    headers.Cookie = convertCookieObjectToString({
      platform_auth_session: cookieAuthSession,
    });
  }

  const response = await platformRequestHelper<ResponseDataType>({
    ...payload,
    headers,
  });

  return response;
});
