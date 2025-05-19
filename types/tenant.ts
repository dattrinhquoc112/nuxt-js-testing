interface Metric {
  metric: string;
  value: string;
  limit: string;
  displayType: string;
  unit: string;
}

export interface ITenantMetric {
  name: string;
  metrics: Metric[];
}
