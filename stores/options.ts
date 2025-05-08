import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';
import type {
  ICountryAllResponse,
  ICountryCodeResponse,
} from './interface/response/share';

export const useOptionsStore = defineStore('option', () => {
  const apiStore = useApiStore();

  async function getMobileCountryCode(): Promise<ICountryCodeResponse> {
    return apiStore.apiRequest<ICountryCodeResponse>({
      endpoint: '/api/v1/general/mobile-country-codes',
      method: MethodEnum.GET,
    });
  }

  async function getAllCountry(): Promise<ICountryAllResponse> {
    return apiStore.apiRequest<ICountryAllResponse>({
      endpoint: '/api/v1/general/countries',
      method: MethodEnum.GET,
    });
  }

  return {
    getMobileCountryCode,
    getAllCountry,
  };
});

export default null;
