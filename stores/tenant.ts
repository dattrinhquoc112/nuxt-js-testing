import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import type { ITenant } from '~/types/common';
import { MethodEnum } from './interface/api';
import type {
  ITenantDetailResponse,
  ICheckLimitResponse,
  IDetailMemberResponse,
  IListRoleResponse,
} from './interface/response/share';
import type {
  RequestTenantPayload,
  RequestUserTenantPayload,
  TypeRole,
} from './interface/request/shared';
import { useAuthStore } from './auth';

export const TENANT_INFO = 'TENANT_INFO';

export const useTenantStore = defineStore('tenant', () => {
  const apiStore = useApiStore();
  const { getInfoUserFromCookie } = useAuthStore();

  function getCurrentTenantInfo() {
    const tenant = localStorage.getItem(TENANT_INFO);
    let tenantObj: ITenant | null = null;
    try {
      if (tenant) {
        tenantObj = JSON.parse(tenant);
      }
    } catch (error) {
      tenantObj = null;
    }
    return tenantObj;
  }

  function setCurrentTenantInfo(tenant: ITenant) {
    localStorage.setItem(TENANT_INFO, JSON.stringify(tenant));
  }

  async function getTenantList() {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: '/api/v1/tenants',
      proxy: true,
      platform: true,
    });
  }
  async function createTenant(data: RequestTenantPayload) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: '/api/v1/tenants',
      proxy: true,
      platform: true,
      data,
    });
  }

  async function updateTenant(id: string, data: RequestTenantPayload) {
    return apiStore.apiRequest({
      method: MethodEnum.PATCH,
      endpoint: `/api/v1/tenants/${id}`,
      proxy: true,
      platform: true,
      data,
    });
  }

  async function getUserTenantByID(tenantID: string, userID: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/tenants/${tenantID}/users/${userID}`,
      proxy: true,
      platform: true,
    });
  }

  async function updateTenantOwner(tenantId: string, targetUserId: string) {
    return apiStore.apiRequest({
      method: MethodEnum.PATCH,
      endpoint: `/api/v1/tenants/${tenantId}/owner?targetUserId=${targetUserId}`,
      proxy: true,
      platform: true,
    });
  }

  async function getUsersTenant(
    id: string | undefined = getInfoUserFromCookie()?.tenant_id,
    data: RequestUserTenantPayload | {} = {}
  ) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/tenants/${id}/users`,
      proxy: true,
      platform: true,
      params: data,
    });
  }

  function getAllRoleTenant(type: TypeRole) {
    return apiStore.apiRequest<IListRoleResponse>({
      method: MethodEnum.GET,
      endpoint: `/api/v1/roles?type=${type}`,
      proxy: true,
      platform: true,
    });
  }

  function switchTenant(data: object) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/oauth2/switch-tenant`,
      data,
      proxyCustom: true,
    });
  }

  function inviteUserToTenant(data: object) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/api/v1/tenants/${getInfoUserFromCookie()?.tenant_id}/users`,
      data,
      proxy: true,
      platform: true,
    });
  }

  function deleteMember(userId: number) {
    return apiStore.apiRequest({
      method: MethodEnum.DELETE,
      endpoint: `/api/v1/tenants/${
        getInfoUserFromCookie()?.tenant_id
      }/users/${userId}`,
      proxy: true,
      platform: true,
    });
  }

  function updateMember(
    userId: number,
    data: Object
  ): Promise<IDetailMemberResponse> {
    return apiStore.apiRequest({
      method: MethodEnum.PATCH,
      endpoint: `/api/v1/tenants/${
        getInfoUserFromCookie()?.tenant_id
      }/users/${userId}`,
      proxy: true,
      platform: true,
      data,
    });
  }

  function getDetailMember(userId: string): Promise<IDetailMemberResponse> {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/tenants/${
        getInfoUserFromCookie()?.tenant_id
      }/users/${userId}`,
      proxy: true,
      platform: true,
    });
  }

  async function getMyDetailInfoTenant(): Promise<IDetailMemberResponse> {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/tenants/${getInfoUserFromCookie()?.tenant_id}/users/${
        getInfoUserFromCookie()?.sub
      }`,
      proxy: true,
      platform: true,
    });
  }
  async function checkFreeTrialLimit(
    type: String = TYPE_CHECK_LIMIT.TENANT_USER
  ): Promise<ICheckLimitResponse> {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/general/free-trial-limits`,
      proxy: true,
      platform: true,
      params: {
        type,
      },
    });
  }

  async function getTenantMetrics(tenantId: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/tenants/${tenantId}/metrics`,
      proxy: true,
      platform: true,
    });
  }

  async function getMetrics() {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/tenants/metrics`,
      proxy: true,
    });
  }

  async function getTenantByID(id: string): Promise<ITenantDetailResponse> {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/tenants/${id}`,
      proxy: true,
      platform: true,
    });
  }

  return {
    getTenantList,
    createTenant,
    getUsersTenant,
    getAllRoleTenant,
    switchTenant,
    getTenantByID,
    getTenantMetrics,
    updateTenant,
    inviteUserToTenant,
    deleteMember,
    updateMember,
    getDetailMember,
    getMyDetailInfoTenant,
    updateTenantOwner,
    checkFreeTrialLimit,
    getUserTenantByID,
    getCurrentTenantInfo,
    setCurrentTenantInfo,
    getMetrics,
  };
});

export default null;
