import { MethodEnum, type Payload } from '@/stores/interface/api';

export default ({
  endpoint = '',
  baseURL = useRuntimeConfig().public.apiHost,
  method = MethodEnum.GET,
  paramsString = '',
  data = {},
  uri = '',
  headers = {},
  redirect = undefined,
}: Payload) => {
  let uriConvert;
  if (method.toUpperCase() === MethodEnum.GET) {
    uriConvert = (uri || `${baseURL}${endpoint}`) + paramsString;
  } else {
    uriConvert = uri || `${baseURL}${endpoint}`;
  }

  return fetch(uriConvert, {
    headers,
    ...(method.toUpperCase() !== MethodEnum.GET && {
      method,
      body: JSON.stringify(data),
    }),
    redirect,
  });
};
