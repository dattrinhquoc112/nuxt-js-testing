import { METRICS_KEY } from '~/constants/common';
import { useTenantStore } from '~/stores/tenant';
import type { ITenantMetric } from '~/types/tenant';

export interface Metric {
  label: string;
  value: number;
  valueUnit?: string;
  total: number;
  totalUnit?: string;
  percent: number;
  description: string;
}

export default function useMetric() {
  const { t } = useI18n();
  const { getMetrics } = useTenantStore();
  const tenantMetric = ref<ITenantMetric>();
  const metrics = ref<Metric[]>([]);
  const metricInfo = reactive({
    isLimitedProject: false,
    isLimitedCapacity: false,
  });
  const modalMetric = reactive({
    warningLimitProject: false,
    warningLimitCapacity: false,
  });

  const handleMetrics = (tenantMetricValue?: ITenantMetric) => {
    metrics.value = [];
    // project count
    const dataProjectCount: Metric = {
      label: t('landing-common-title-project_count_title'),
      value: Number(
        tenantMetricValue?.metrics.find(
          (elem) => elem.metric === 'PROJECTS_CREATED'
        )?.value || 0
      ),
      total: Number(
        tenantMetricValue?.metrics.find(
          (elem) => elem.metric === 'TOTAL_PROJECT'
        )?.value || 0
      ),
      percent: 0,
      description: '',
    };

    dataProjectCount.percent =
      dataProjectCount.value && dataProjectCount.total
        ? (dataProjectCount.value * 100) / dataProjectCount.total
        : 0;
    dataProjectCount.description = `${dataProjectCount.value}/${dataProjectCount.total}`;

    // Capacity
    const dataCapacity: Metric = {
      label: t('landing-common-title-storage_space_title'),
      value: Number(
        tenantMetricValue?.metrics.find(
          (elem) => elem.metric === METRICS_KEY.TOTAL_CAPACITY_USED
        )?.value || 0
      ),
      valueUnit:
        tenantMetricValue?.metrics.find(
          (elem) => elem.metric === METRICS_KEY.TOTAL_CAPACITY_USED
        )?.unit || 'GB',
      total: Number(
        tenantMetricValue?.metrics.find(
          (elem) => elem.metric === METRICS_KEY.TOTAL_CAPACITY
        )?.value || 0
      ),
      totalUnit:
        tenantMetricValue?.metrics.find(
          (elem) => elem.metric === METRICS_KEY.TOTAL_CAPACITY
        )?.unit || 'GB',
      percent: 0,
      description: '',
    };

    const dataCapacityValue = convertToKB(
      `${dataCapacity.value}${dataCapacity.valueUnit}`
    );
    const dataCapacityTotal = convertToKB(
      `${dataCapacity.total}${dataCapacity.totalUnit}`
    );

    dataCapacity.percent =
      dataCapacityValue && dataCapacityTotal
        ? (dataCapacityValue * 100) / dataCapacityTotal
        : 0;

    dataCapacity.description = `${t('landing-common-field-storage_used', {
      size: dataCapacity.value,
      unit: dataCapacity.valueUnit,
    })}/${t('landing-common-field-storage_total', {
      size: dataCapacity.total,
      unit: dataCapacity.totalUnit,
    })}`;

    metricInfo.isLimitedProject =
      dataProjectCount.value >= dataProjectCount.total;
    metricInfo.isLimitedCapacity = dataCapacity.value >= dataCapacity.total;

    metrics.value.push(dataProjectCount);
    metrics.value.push(dataCapacity);
  };

  const getTenantMetric = async () => {
    const res = await getMetrics();
    tenantMetric.value = res.data;
    handleMetrics(tenantMetric.value);
  };
  const checkReachLimit = async (): Promise<Boolean> => {
    const res = await getMetrics();
    const { metrics } = res?.data;
    if (metrics) {
      const totalCapacity = metrics.find(
        (item: any) => item.metric === METRICS_KEY.TOTAL_CAPACITY
      );
      const totalCapacityUsed = metrics.find(
        (item: any) => item.metric === METRICS_KEY.TOTAL_CAPACITY_USED
      );
      if (!totalCapacityUsed.value) {
        return false;
      }
      if (
        (totalCapacity.value && totalCapacityUsed.value) ||
        !totalCapacityUsed.value
      ) {
        const threshold = 0.75;
        const totalCapacityKb = convertToKB(
          `${totalCapacity.value}${totalCapacity.unit}`
        );
        const totalCapacityUsedKb = convertToKB(
          `${totalCapacityUsed.value}${totalCapacityUsed.unit}`
        );
        if (
          totalCapacityUsedKb &&
          totalCapacityKb &&
          totalCapacityUsedKb > totalCapacityKb * threshold
        ) {
          return true;
        }
      }
      return false;
    }
    return false;
  };
  const handleModal = () => {
    modalMetric.warningLimitProject = metricInfo.isLimitedProject;
    modalMetric.warningLimitCapacity = metricInfo.isLimitedCapacity;
  };
  return {
    metrics,
    tenantMetric,
    metricInfo,
    modalMetric,
    handleModal,
    handleMetrics,
    getTenantMetric,
    checkReachLimit,
  };
}
