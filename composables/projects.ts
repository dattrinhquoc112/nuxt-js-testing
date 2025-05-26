import { useTenantStore } from '~/stores/tenant';
import { useUploadStore } from '~/stores/upload';
import type { IProject } from '~/types/project';

export default function useProjects() {
  const { t } = useI18n();
  const { getCurrentTenantInfo } = useTenantStore();
  const { getFileURL } = useUploadStore();
  const tenantName = getCurrentTenantInfo()?.name;
  const getProjectUrl = (project?: IProject): string => {
    if (!project) return '';
    const host = window.location.origin;
    return new URL(`${host}/${tenantName}/${project.name}`).href;
  };

  const getStatus = (status: string) => {
    const trans: { [key: string]: string } = {
      PENDING_PUBLISH: t('landing-status-label-status_pending'),
      NOT_STARTED: t('landing-status-label-status_not_started'),
      STARTED: t('landing-status-label-status_started'),
      PUBLISHED: t('landing-status-label-status_published'),
      ENDED: t('landing-status-label-status_ended'),
    };
    return trans[status];
  };

  const getImage = (uri?: string) => {
    const match = uri?.match(/^gs:\/\/[^/]+\/(.+)$/);
    const path = match ? match[1] : '';
    const endpoint = `/general/media/${path}`;
    const url = getFileURL(endpoint);
    return url;
  };

  return {
    getProjectUrl,
    getStatus,
    getImage,
  };
}
