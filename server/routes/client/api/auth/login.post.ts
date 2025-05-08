import type { H3Event } from 'h3';
import requestFetch from '@/utils/requestFetch';
import { convertCookieObjectToString } from '@/utils/cookieHelper';

export default defineEventHandler(async (event: H3Event) => {
  const cookie = parseCookies(event);
  const payload = await readBody(event);

  const response = await requestFetch({
    endpoint: '/api/v1/auth/login',
    method: payload.method,
    redirect: 'manual',
    data: payload.data,
    headers: {
      ...payload.headers,
      Cookie: convertCookieObjectToString(cookie),
      'Content-Type': 'application/json',
    },
  });
  const headers = Object.fromEntries(response.headers.entries());
  if (headers.location) {
    return { redirect: headers.location };
  }
  return response;
});
