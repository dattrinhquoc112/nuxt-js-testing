import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from '@/stores/interface/api';
import { log as logRequest } from '@/stores/entity/request';
import type { RequestLogPayload } from './interface/requestSerialize/log';

export const useLogStore = defineStore('log', () => {
  const apiStore = useApiStore();

  async function submitLog({
    level,
    applicationSide,
    res,
    req,
  }: RequestLogPayload): Promise<void> {
    try {
      await apiStore.apiRequest<void>({
        endpoint: '/api/log',
        method: MethodEnum.POST,
        isServerSide: true,
        data: new logRequest.Log({
          level,
          applicationSide,
          res,
          req,
        }),
      });
    } catch (error: any) {
      /* empty */
    }
  }

  return {
    submitLog,
  };
});

export default null;
