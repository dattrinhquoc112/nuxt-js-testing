import { recordLog } from '@/utils/logger';
import { decodeBase64, decryptWithCBC } from '@/utils/cryptoHelper';
import { LogApplicationSideEnum, LogLevelEnum } from '@/types/enum';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const request = {
    method: event.method,
    url: event._path,
    headers: getHeaders(event),
    body,
  };

  const authorization = event.headers.get('authorization');
  if (!authorization) {
    const response = {
      statusCode: 401,
      statusMessage: 'Unauthorized',
    };
    recordLog({
      level: LogLevelEnum.ERROR,
      applicationSide: LogApplicationSideEnum.SERVER,
      req: request,
      res: response,
    });
    throw createError({ ...response, stack: undefined });
  }

  try {
    const { serverSideTokenKey, serverSideTokenIV, serverSideExpireTime } =
      useRuntimeConfig();
    const value = decryptWithCBC(
      authorization,
      decodeBase64(serverSideTokenKey),
      decodeBase64(serverSideTokenIV)
    );
    if (
      JSON.parse(value || '{}').time + Number(serverSideExpireTime) <
      new Date().getTime()
    ) {
      throw new Error('Invalid token');
    }
  } catch (error) {
    const response = {
      statusCode: 401,
      statusMessage: 'Unauthorized',
    };
    recordLog({
      level: LogLevelEnum.ERROR,
      applicationSide: LogApplicationSideEnum.SERVER,
      req: request,
      res: response,
    });
    throw createError({ ...response, stack: undefined });
  }

  if (
    !Object.values(LogLevelEnum).includes(body.level as LogLevelEnum) ||
    !Object.values(LogApplicationSideEnum).includes(
      body.applicationSide as LogApplicationSideEnum
    )
  ) {
    const response = {
      statusCode: 400,
      statusMessage: 'Invalid level or applicationSide',
    };
    recordLog({
      level: LogLevelEnum.ERROR,
      applicationSide: LogApplicationSideEnum.SERVER,
      req: request,
      res: response,
    });
    throw createError({ ...response, stack: undefined });
  }

  recordLog({
    level: body.level,
    applicationSide: body.applicationSide,
    req: {
      ip:
        event.headers.get('x-forwarded-for')?.split(',')[0] ||
        event.headers.get('x-real-ip'),
      userAgent: event.headers.get('user-agent'),
      secChUa: event.headers.get('sec-ch-ua'),
      secChUaMobile: event.headers.get('sec-ch-ua-mobile'),
      secChUaPlatform: event.headers.get('sec-ch-ua-platform'),
      secChUaPlatformVersion: event.headers.get('sec-ch-ua-platform-version'),
      secChUaModel: event.headers.get('sec-ch-ua-model'),
      ...body.req,
    },
    res: body.res,
  });
  return {};
});
