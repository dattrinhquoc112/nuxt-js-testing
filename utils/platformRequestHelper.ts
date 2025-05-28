import { MethodEnum, type Payload } from '@/stores/interface/api';

export default <ResponseDataType>({
  endpoint = '',
  baseURL = useRuntimeConfig().public.apiPlatformHost,
  method = MethodEnum.GET,
  params = {},
  data = {},
  uri = '',
  headers = {},
}: Payload): Promise<ResponseDataType> =>
  $fetch(uri || `${baseURL}${endpoint}`, {
    headers,
    ...(method.toUpperCase() === MethodEnum.GET
      ? { query: { ...params } }
      : { method, body: { ...data } }),
  });
