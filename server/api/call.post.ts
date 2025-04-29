import type { H3Event } from 'h3';
import requestHelper from '@/utils/requestHelper';

export default defineEventHandler(async <ResponseDataType>(event: H3Event) => {
  const payload = await readBody(event);
  const response = await requestHelper<ResponseDataType>(payload);
  return response;
});
