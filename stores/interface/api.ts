// eslint-disable-next-line no-shadow
export enum MethodEnum {
  GET = 'GET',
  HEAD = 'HEAD',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}

export interface Payload {
  endpoint?: string;
  method?: MethodEnum;
  headers?: HeadersInit;
  baseURL?: string;
  params?: object;
  data?: object;
  uri?: string;
  auth?: boolean;
  extra?: string;
  proxy?: boolean;
  isServerSide?: boolean;
  proxyCustom?: boolean;
  credentials?: string;
  paramsString?: string;
  redirect?: RequestRedirect | undefined;
  platform?: boolean;
}
