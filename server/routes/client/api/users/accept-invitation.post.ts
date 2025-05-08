import { type H3Event, setCookie } from 'h3';
import { parseSetCookie } from '@/utils/cookieHelper';
import requestFetch from '@/utils/requestFetch';
import { MethodEnum } from '@/stores/interface/api';
import { KEY_LOCAL_STORAGE } from '@/utils/constants';
import jwtDecode from '@/utils/jwtDecode';

export default defineEventHandler(async (event: H3Event) => {
  const payload = await readBody(event);

  const responseToken = await requestFetch({
    method: MethodEnum.POST,
    endpoint: '/api/v1/users/accept-invitation',
    redirect: 'manual',
    data: payload.data,
    headers: {
      ...payload.headers,
      'Content-Type': 'application/json',
    },
  });
  const newHeaders = Object.fromEntries(responseToken.headers.entries());
  if (newHeaders['set-cookie']) {
    const newCookie = parseSetCookie(newHeaders['set-cookie']);
    setCookie(
      event,
      'platform_auth_session',
      newCookie.value,
      newCookie.options
    );
    setCookie(
      event,
      KEY_LOCAL_STORAGE.IS_AUTHENTICATED,
      KEY_LOCAL_STORAGE.TOKEN_TEMPORARY
    );

    setCookie(
      event,
      KEY_LOCAL_STORAGE.INFO_USER,
      JSON.stringify(jwtDecode(newCookie.value)),
      {
        httpOnly: false,
        secure: true,
        path: '/',
      }
    );
  }

  return responseToken;
});
