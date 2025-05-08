import { setCookie, type H3Event } from 'h3';
import { parseSetCookie } from '@/utils/cookieHelper';
import requestFetch from '@/utils/requestFetch';
import { MethodEnum } from '@/stores/interface/api';

export default defineEventHandler(async (event: H3Event) => {
  let cookie;

  const {
    apiClientId,
    apiCode,
    apiScope,
    apiRedirectUri,
    apiState,
    apiNonce,
    apiChallengeMethod,
  } = useRuntimeConfig();

  const paramsObj: Record<string, string> = {
    client_id: apiClientId,
    response_type: apiCode,
    scope: apiScope,
    redirect_uri: apiRedirectUri,
    state: apiState,
    nonce: apiNonce,
    code_challenge_method: apiChallengeMethod,
  };

  const queryParams = new URLSearchParams(paramsObj);

  const response = await requestFetch({
    endpoint: '/api/v1/oauth2/auth',
    method: MethodEnum.GET,
    redirect: 'manual',
    paramsString: `?${queryParams.toString()}`,
  });

  const headers = Object.fromEntries(response.headers.entries());

  if (headers['set-cookie']) {
    cookie = parseSetCookie(headers['set-cookie']);
    setCookie(event, cookie.name, cookie.value, cookie.options);
    return { redirect: '/auth' };
  }
  return response;
});
