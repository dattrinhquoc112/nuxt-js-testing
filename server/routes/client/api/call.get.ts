import { type H3Event } from 'h3';
import { parseCookies } from 'h3';
import { convertCookieObjectToString } from '@/utils/cookieHelper';
import landingRequestHelper from '~/utils/landingRequestHelper';
import { MethodEnum } from '~/stores/interface/api';

export default defineEventHandler(async <ResponseDataType>(event: H3Event) => {
  const cookie = parseCookies(event);
  const query = getQuery(event);

  const headers: Record<string, string> = {};
  if (cookie?.platform_auth_session) {
    headers.Cookie = convertCookieObjectToString({
      platform_auth_session: cookie.platform_auth_session,
    });
  }

  const response = await landingRequestHelper<ResponseDataType>({
    method: MethodEnum.GET,
    endpoint: query.endpoint as string,
    headers,
  });

  return response;
});
