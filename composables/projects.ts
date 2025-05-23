import { useTenantStore } from '~/stores/tenant';
import type { IProject } from '~/types/project';

export default function useProjects() {
  const { getCurrentTenantInfo } = useTenantStore();
  const tenantName = getCurrentTenantInfo()?.name;
  const getProjectUrl = (project: IProject): string => {
    const host = window.location.origin;
    return new URL(`${host}/${tenantName}/${project.name}`).href;
  };

  return {
    getProjectUrl,
  };
}
