import { type H3Event } from 'h3';
import requestHelper from '@/utils/requestHelper';
import type { IOauthToken } from '@/stores/interface/response/auth';
import { setPlatformAuthCookieOnServer } from '@/utils/cookieHelper';
import { KEY_LOCAL_STORAGE } from '@/utils/constants';

export default defineEventHandler(async (event: H3Event) => {
  const payload = await readBody(event);

  const response: IOauthToken = await requestHelper({
    ...payload,
    endpoint: '/api/v1/users/confirm-email',
  });

  setPlatformAuthCookieOnServer(
    response,
    event,
    KEY_LOCAL_STORAGE.TOKEN_TEMPORARY
  );

  return response;
});
