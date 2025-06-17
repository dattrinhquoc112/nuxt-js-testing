import { type H3Event, parseCookies, setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { MethodEnum } from '~/stores/interface/api';
import {
  convertCookieObjectToString,
  getOriginDomain,
} from '~/utils/cookieHelper';

const COOKIE_NAME = 'landing_web_session';
const COOKIE_MAX_AGE_SECONDS = 5 * 60;

function generateToken({ scope }: { scope: any }) {
  const payload = {
    iss: 'aiaas',
    aud: 'landing',
    type: 'LANDING_WEB_ACCESS',
    scope,
  };

  const { jwtSecretKey } = useRuntimeConfig();
  if (!jwtSecretKey) throw new Error('Missing JWT_SECRET_KEY env var');

  return jwt.sign(payload, jwtSecretKey, {
    algorithm: 'RS256',
    expiresIn: COOKIE_MAX_AGE_SECONDS,
  });
}

export default defineEventHandler(async (event: H3Event) => {
  const cookie = parseCookies(event);
  let token = cookie[COOKIE_NAME];

  let isExpired = true;
  if (token) {
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        isExpired = false;
      }
    } catch {
      isExpired = true;
    }
  }

  if (isExpired) {
    let scope = '';
    if (cookie.INFO_USER) {
      scope = JSON.parse(cookie.INFO_USER).scope;
    }
    token = generateToken({ scope });

    const host = event.node.req.headers.host || '';
    const domain = getOriginDomain(host);
    setCookie(event, COOKIE_NAME, token, {
      path: '/',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      domain: domain !== 'localhost' ? `.${domain}` : undefined,
    });
  }

  const payload = await readBody(event);

  const headers = {
    ...payload.headers,
    'X-Path': `${useRuntimeConfig().urlFeHost}/event`,
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Cookie = convertCookieObjectToString({
      [COOKIE_NAME]: token,
    });
  }

  const response = await $fetch(
    `${
      useRuntimeConfig().public.apiLandingHost
    }/web/api/v1/projects/published-content?tenantName=${encodeURIComponent(
      payload.params.tenantName
    )}&eventEnglishName=${payload.params.eventEnglishName}`,
    {
      method: MethodEnum.GET,
      headers,
    }
  );

  return response;
});
