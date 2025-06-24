<template>
  <div class="tenant">
    <vi-typography type="headline-m" class="ellipsis-text-line"
      >Hi!👋 {{ infoUser?.data?.username }}</vi-typography
    >
    <vi-spin
      v-if="isLoading"
      height="400px"
      width="100%"
      class="mt-16"
      :loading="isLoading"
    />
    <vi-scroll v-else-if="listTenant?.length" height="400px" class="mt-16">
      <div class="list-tenant">
        <div
          class="item"
          v-for="(item, index) in listTenant"
          :key="index"
          @click="() => handleAccessTenant(item.id)"
        >
          <div class="item-name neutral-white-alpha-100-text">
            <vi-typography class="ellipsis-text-line" type="subtitle-large">{{
              item.alias
            }}</vi-typography>
          </div>
          <div class="neutral-white-alpha-60-text">
            <vi-typography type="caption-large-700">{{
              $t(item.roleOfTheTenant.name)
            }}</vi-typography>
          </div>
          <div class="item-icon">
            <vi-icon name="ic_chevron_right" size="24" color="#fff"></vi-icon>
          </div>
        </div>
      </div>
    </vi-scroll>
    <div v-else class="tenant-empty mt-16">
      <img src="/assets/images/tenant_empty.png" alt="tenant empty" />
      <vi-typography class="mt-16" type="subtitle-large">{{
        $t('auth-tenant_mgmt-description-description_no_team')
      }}</vi-typography>
    </div>
    <vi-button
      class="btn-create"
      @click="
        navigateTo(`${useRuntimeConfig().public.platformHost}/tenant/create`, {
          external: true,
        })
      "
      >{{ $t('auth-account-action-button_create_team') }}</vi-button
    >
    <vi-button
      class="btn-signin-other"
      type="standard-subtle"
      @click="userLogout"
      >{{ $t('common-action-button-button_use_another_account') }}</vi-button
    >
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { type IUserInfoResponse } from '@/stores/interface/response/share';
import { useTenantStore } from '@/stores/tenant';
import { useUserStore } from '@/stores/user';
import type { ITenant } from '@/types/common';

definePageMeta({
  middleware: ['auth'],
});
const listTenant = ref<ITenant[]>();
const infoUser = ref<IUserInfoResponse>();
const isLoading = ref<boolean>(false);

const { getTenantList, switchTenant } = useTenantStore();
const { getDetailInfoUser } = useUserStore();
const { userLogout } = useAuthStore();

const handleAccessTenant = async (tenantId: string | number) => {
  try {
    if (tenantId) {
      await switchTenant({ tenantId });
      triggerChangeStorage();
      navigateTo('');
    }
  } catch (error) {}
};

onMounted(async () => {
  try {
    isLoading.value = true;
    infoUser.value = await getDetailInfoUser();
    const response = await getTenantList();
    if (response?.data?.length) {
      listTenant.value = response.data;
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.tenant {
  width: 400px;
  max-width: 100%;
  height: 590px;
  max-height: 85vh;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .btn-create,
  .btn-signin-other {
    width: 100%;
    margin-top: 24px;
  }
  .tenant-empty {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.03);
    color: $neutral-white-alpha-60;
    img {
      width: 58px;
      object-fit: contain;
    }
  }
  .list-tenant {
    box-sizing: border-box;
    border-radius: 8px;
    border: 0.5px solid $neutral-white-alpha-7;
    background: rgba(255, 255, 255, 0.03);
    .item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      position: relative;
      box-sizing: border-box;
      min-height: 86px;
      width: calc(100% - 32px);
      margin: 16px auto;
      border-radius: 8px;
      padding: 20px 16px 20px 24px;
      border: 0.5px solid $neutral-white-alpha-7;
      background: linear-gradient(
          90deg,
          rgba(0, 145, 255, 0.03) 22.74%,
          rgba(30, 221, 0, 0.03) 73.19%
        ),
        $neutral-white-alpha-7;
      backdrop-filter: blur(15px);
      .item-name {
        width: calc(100% - 36px);
      }
      .item-icon {
        display: flex;
        position: absolute;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
      }
      &:hover {
        filter: brightness(1.2);
        cursor: pointer;
      }
    }
  }
}
</style>
