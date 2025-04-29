export default defineEventHandler((event) => {
  const getHeaderValue = (
    headers: Record<string, string | string[] | undefined>,
    key: string
  ): string | undefined =>
    headers[key]?.toString()?.replace(/"/g, '') || undefined;

  const { req } = event.node;
  const xForwardedFor = getHeaderValue(req.headers, 'x-forwarded-for') || '';
  const ipAddress = xForwardedFor
    ? xForwardedFor.split(',')[0]
    : req.socket.remoteAddress;
  const userAgent = getHeaderValue(req.headers, 'user-agent');
  const secChUa = getHeaderValue(req.headers, 'sec-ch-ua');
  const secChUaMobile = getHeaderValue(req.headers, 'sec-ch-ua-mobile');
  const secChUaPlatform = getHeaderValue(req.headers, 'sec-ch-ua-platform');
  const secChUaPlatformVersion = getHeaderValue(
    req.headers,
    'sec-ch-ua-platform-version'
  );
  const secChUaModel = getHeaderValue(req.headers, 'sec-ch-ua-model');
  Object.assign(event.context, {
    ipAddress,
    userAgent,
    secChUa,
    secChUaMobile,
    secChUaPlatform,
    secChUaPlatformVersion,
    secChUaModel,
  });
});
