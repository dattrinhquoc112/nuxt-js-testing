import { type H3Event, parseCookies, setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import {
  convertCookieObjectToString,
  getOriginDomain,
} from '~/utils/cookieHelper';
import requestHelper from '~/utils/requestHelper';

const COOKIE_NAME = 'landing_web_session';
const COOKIE_MAX_AGE_SECONDS = 5 * 60;

function generateToken() {
  const payload = {
    iss: 'aiaas',
    aud: 'landing',
    type: 'LANDING_WEB_ACCESS',
  };

  const { jwtSecretKey } = useRuntimeConfig();
  if (!jwtSecretKey) throw new Error('Missing JWT_SECRET_KEY env var');

  return jwt.sign(payload, jwtSecretKey, {
    algorithm: 'RS256',
    expiresIn: COOKIE_MAX_AGE_SECONDS,
  });
}

export default defineEventHandler(async <ResponseDataType>(event: H3Event) => {
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
    token = generateToken();
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
  };
  if (token) {
    headers.Cookie = convertCookieObjectToString({
      [COOKIE_NAME]: token,
    });
  }

  const response = await requestHelper<ResponseDataType>({
    ...payload,
    headers,
    baseURL: `${useRuntimeConfig().public.apiLandingHost}/web`,
  });

  return response;
});
