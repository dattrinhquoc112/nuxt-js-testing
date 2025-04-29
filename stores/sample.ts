import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { sample as sampleResponse } from '@/stores/entity/response';
import type { SampleResponseData } from '@/stores/interface/response/sample';
import type { SampleResponseDataSerialize } from '@/stores/interface/responseSerialize/sample';
import { MethodEnum } from './interface/api';

const namespace = '/draft';

export const useSampleStore = defineStore('sample', () => {
  const apiStore = useApiStore();
  const sampleData = ref<SampleResponseDataSerialize>();
  const sampleRequesting = ref(false);
  function sampleSuccess(data: SampleResponseData) {
    sampleData.value = new sampleResponse.SampleData(data).serialize();
    sampleRequesting.value = false;
  }
  function sampleFailed(e: Error) {
    console.log(e);
  }
  async function getSampleData({ proxy = false }: { proxy: boolean }) {
    try {
      sampleRequesting.value = true;
      const response = await apiStore.apiRequest<SampleResponseData>({
        method: MethodEnum.GET,
        endpoint: `${namespace}/sample`,
        proxy,
      });
      sampleSuccess(response);
    } catch (e) {
      sampleFailed(new Error(JSON.stringify(e)));
    } finally {
      sampleRequesting.value = false;
    }
  }

  return { getSampleData, sampleRequesting, sampleData };
});

export default null;
