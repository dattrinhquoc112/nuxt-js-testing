import type { IApiError } from '@/stores/interface/response/share';

function isApiError(error: unknown): error is IApiError {
  return typeof error === 'object' && error !== null;
}
export default function getMessageErrorBackend(error: any, t: any) {
  let errorData = error?.data?.data;
  if (!errorData) {
    errorData = error?.data;
  }

  if (errorData && isApiError(errorData)) {
    const message = errorData?.error?.message;
    const apiErrorCode = errorData?.error?.apiErrorCode;
    if (apiErrorCode || message) {
      return apiErrorCode ? t(apiErrorCode) : message;
    }
    return '';
  }

  return '';
}
