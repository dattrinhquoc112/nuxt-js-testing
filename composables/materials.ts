import { METRICS_KEY, THRESH_HOLD } from '~/constants/common';
import { useApiStore } from '~/stores/api';
import { MethodEnum } from '~/stores/interface/api';
import useMetric from './metric';

export default function useMaterials({
  listMaterial,
  editorID,
}: {
  listMaterial: Ref<any>;
  editorID: any;
}) {
  const { getTenantMetric, tenantMetric } = useMetric();
  const apiStore = useApiStore();
  const initMaterial = ref();
  const totalCapacity = computed(() => {
    const metrics = tenantMetric.value?.metrics;
    if (metrics) {
      const total = metrics.find(
        (item) => item.metric === METRICS_KEY.TOTAL_CAPACITY
      );
      const displayValue = `${total?.value}${total?.unit}`;
      return {
        displayValue,
        value: parseFileSize(displayValue),
      };
    }
    return { displayValue: '', value: 0 };
  });
  const totalCapacityUsedInPJ = computed(() => {
    const total = listMaterial?.value?.reduce(
      (sum: number, item: any) => sum + (item?.fileSize ?? 0),
      0
    );
    return {
      displayValue: convertFileSize(total) || '',
      value: total || 0,
    };
  });
  const differenceRatio = computed(() => {
    return (
      (totalCapacityUsedInPJ.value?.value ?? 0) -
      (initMaterial.value?.value ?? 0)
    );
  });
  const totalCapacityUsed = computed(() => {
    const metrics = tenantMetric.value?.metrics;
    if (metrics) {
      const total = metrics.find(
        (item) => item.metric === METRICS_KEY.TOTAL_CAPACITY_USED
      );
      const displayValue = `${total?.value}${total?.unit}`;
      const finalValue = parseFileSize(displayValue) + differenceRatio.value;
      return {
        displayValue: convertFileSize(finalValue),
        value: finalValue,
      };
    }
    return { displayValue: '', value: 0 };
  });
  watch(editorID, async (newVal) => {
    if (newVal) {
      const list = await apiStore.apiRequest({
        method: MethodEnum.GET,
        endpoint: `/api/v1/projects/${newVal}/materials`,
        proxy: true,
      });
      const { data } = list;
      if (data) {
        const total = data.reduce(
          (sum: number, item: any) => sum + (item?.fileSize ?? 0),
          0
        );
        initMaterial.value = {
          displayValue: convertFileSize(total),
          value: total,
        };
      }
    }
  });

  const isExceedLimit = computed(() => {
    return (
      (totalCapacityUsed.value?.value ?? 0) >
      (totalCapacity.value?.value ?? 0) * THRESH_HOLD
    );
  });
  provide(PROVIDE.METRIC, {
    totalCapacity,
    totalCapacityUsed,
    totalCapacityUsedInPJ,
    initMaterial,
    isExceedLimit,
  });
  onMounted(() => {
    getTenantMetric();
  });
  return {
    totalCapacity,
    totalCapacityUsed,
    totalCapacityUsedInPJ,
    initMaterial,
    isExceedLimit,
  };
}
