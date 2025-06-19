import { type H3Event } from 'h3';
import { refreshToken } from '~/server/utils/refreshTokenHelper';
import landingRequestHelper from '~/utils/landingRequestHelper';
import { convertCookieObjectToString } from '@/utils/cookieHelper';

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

  const response = await landingRequestHelper<ResponseDataType>({
    ...payload,
    headers,
  });

  return response;
});
