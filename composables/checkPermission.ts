import { useAuthStore } from '~/stores/auth';

export default function useCheckPermission() {
  const { getInfoUserFromCookie } = useAuthStore();
  const PERMISSION = ref<{ isViewer: boolean; isEditor: boolean }>({
    isViewer: false,
    isEditor: false,
  });
  onMounted(() => {
    const infoUser = getInfoUserFromCookie();
    if (infoUser) {
      PERMISSION.value.isViewer = infoUser.scope.includes(
        'app_ld_projects:read'
      );
      PERMISSION.value.isEditor = infoUser.scope.includes(
        'app_ld_projects:create'
      );
    }
  });
  return { PERMISSION };
}
