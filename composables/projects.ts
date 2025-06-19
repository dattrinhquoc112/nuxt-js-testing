import { useUploadStore } from '~/stores/upload';
import { nanoid } from 'nanoid';

export default function useProjects() {
  const { t } = useI18n();
  const { getFileURL } = useUploadStore();

  const generateSlug = (eventName: string): string => {
    const slug = eventName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return slug;
  };

  const getProjectUrl = (eventEnglishName?: string): string => {
    if (eventEnglishName?.trim()) {
      const host = window.location.origin;
      const slug = generateSlug(eventEnglishName);
      const id = nanoid(6);
      return `${host}/event/${slug}-${id}`;
    }
    return '';
  };

  const handleKeyword = (newValue: string, maxKeywords = 10): string => {
    let keywords = newValue
      .trim()
      .split(',')
      .filter((k) => k !== '');

    if (keywords.length > maxKeywords) {
      keywords = keywords.slice(0, maxKeywords);
    }

    const finalValue = keywords.join(',') + (newValue.endsWith(',') ? ',' : '');
    return finalValue;
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
    handleKeyword,
  };
}
