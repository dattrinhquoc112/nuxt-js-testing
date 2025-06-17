import { type H3Event } from 'h3';
import { convertCookieObjectToString } from '@/utils/cookieHelper';
import platformRequestHelper from '~/utils/platformRequestHelper';

export default defineEventHandler(async <ResponseDataType>(event: H3Event) => {
  const cookie = parseCookies(event);

  const payload = await readBody(event);
  const headers = {
    ...payload.headers,
  };
  if (cookie) {
    headers.Cookie = convertCookieObjectToString({
      platform_auth_session: cookie.platform_auth_session,
    });
  }
  const response = await platformRequestHelper<ResponseDataType>({
    ...payload,
    headers,
  });
  return response;
});
