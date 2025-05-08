import requestHelper from '@/utils/requestHelper';
import { type H3Event } from 'h3';
import { objectToUrlEncoded } from '@/utils/convert';
import type { IOauthToken } from '@/stores/interface/response/auth';
import { setPlatformAuthCookieOnServer } from '@/utils/cookieHelper';
import { KEY_LOCAL_STORAGE } from '@/utils/constants';

export default defineEventHandler(async (event: H3Event) => {
  const payload = await readBody(event);

  const { apiGrantType, apiRedirectUri, apiClientId, apiClientSecret } =
    useRuntimeConfig();

  const dataServerSide = {
    redirect_uri: apiRedirectUri,
    client_id: apiClientId,
    client_secret: apiClientSecret,
    grant_type: apiGrantType,
  };

  payload.data = objectToUrlEncoded({ ...payload.data, ...dataServerSide });

  const response: IOauthToken = await requestHelper({
    ...payload,
    endpoint: '/api/v1/oauth2/token',
  });
  setPlatformAuthCookieOnServer(
    response,
    event,
    KEY_LOCAL_STORAGE.TOKEN_TEMPORARY
  );

  return response;
});
