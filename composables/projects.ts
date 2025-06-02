import { useTenantStore } from '~/stores/tenant';
import { useUploadStore } from '~/stores/upload';
import type { IProject } from '~/types/project';

export default function useProjects() {
  const { t } = useI18n();
  const { getCurrentTenantInfo } = useTenantStore();
  const { getFileURL } = useUploadStore();
  const tenantName = getCurrentTenantInfo()?.name;
  const getProjectUrl = (eventEnglishName?: string): string => {
    if (eventEnglishName && tenantName) {
      const host = window.location.origin;
      return new URL(`${host}/event/${tenantName}/${eventEnglishName}`).href;
    }
    return '';
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
    if (!uri) return '';

    if (uri.startsWith('blob:')) {
      return uri;
    }
    const match = uri?.match(/^gs:\/\/[^/]+\/(.+)$/);
    const path = match ? match[1] : '';
    if (!path) {
      return uri;
    }
    const endpoint = `/general/media?fileKey=${path}`;
    const url = getFileURL(endpoint);
    return url;
  };

  return {
    getProjectUrl,
    getStatus,
    getImage,
  };
}
