import { TypeRole } from '~/stores/interface/request/shared';
import type { IListRoleResponse } from '~/stores/interface/response/share';
import { useTenantStore } from '~/stores/tenant';
import type { IRoleOption } from '~/types/common';

export default function useOptionRole() {
  const { t } = useI18n();
  const { getAllRoleTenant } = useTenantStore();
  const tenantRoleOption = ref<IRoleOption[]>();
  const appRoleOption = ref<IRoleOption[]>();

  const fetchTenantRole = async () => {
    try {
      const listRole: IListRoleResponse = await getAllRoleTenant(
        TypeRole.TENANT_ROLE
      );
      tenantRoleOption.value = listRole.data.map((item) => ({
        value: item.id,
        text: t(item.name),
        nameRole: item.name,
      }));
      return tenantRoleOption.value;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const fetchAppRole = async () => {
    try {
      const listRole: IListRoleResponse = await getAllRoleTenant(
        TypeRole.APP_ROLE
      );
      appRoleOption.value = listRole.data.map((item) => ({
        value: item.id,
        text: t(item.name),
        nameRole: item.name,
      }));
      return appRoleOption.value;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const filterTenantRoleByName = (roleName: string) => {
    if (!tenantRoleOption.value?.length) return;
    tenantRoleOption.value = tenantRoleOption.value.filter(
      (role: IRoleOption) => {
        if (role?.nameRole) {
          return CHECK_ROLES[roleName] >= CHECK_ROLES[role.nameRole];
        }
        return false;
      }
    );
  };

  return {
    tenantRoleOption,
    appRoleOption,
    fetchTenantRole,
    fetchAppRole,
    filterTenantRoleByName,
  };
}
