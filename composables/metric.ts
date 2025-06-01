import { useTenantStore } from '~/stores/tenant';
import type { ITenantMetric } from '~/types/tenant';

interface Metric {
  label: string;
  value: number;
  total: number;
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
      label: t('common-form-field-field_project_count'),
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
      label: t('common-form-field-field_storage'),
      value: Number(
        tenantMetricValue?.metrics.find(
          (elem) => elem.metric === 'TOTAL_CAPACITY_USED'
        )?.value || 0
      ),
      total: Number(
        tenantMetricValue?.metrics.find(
          (elem) => elem.metric === 'TOTAL_CAPACITY'
        )?.value || 0
      ),
      percent: 0,
      description: '',
    };

    dataCapacity.percent =
      dataCapacity.value && dataCapacity.total
        ? (dataCapacity.value * 100) / dataCapacity.total
        : 0;

    dataCapacity.description = `${t('landing-common-field-storage_used', {
      value: dataCapacity.value,
      unit: 'MB',
    })}/${t('landing-common-field-storage_total', {
      limit: dataCapacity.total,
      unit: 'MB',
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
  };
}
