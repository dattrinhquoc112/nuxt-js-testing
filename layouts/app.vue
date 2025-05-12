<template>
  <div class="layout-app">
    <vi-menu
      class="navbar-left"
      :list-option="navOptions"
      :text-back="$t('app-navigation-button-back')"
      :app-name="$t('app-main-menu-section_voice_clone')"
      type="app"
    >
      <template #logo>
        <nuxt-link to="/">
          <img src="@/assets/images/logo.png" alt="" />
        </nuxt-link>
      </template>
      <template #icon-right>
        <vi-icon name="ic_sidemenu" size="24" color="#fff" />
      </template>
      <template #icon-back>
        <vi-icon name="ic_chevron_left" size="16" />
      </template>
      <template #avatar>
        <div class="avatar">
          <img
            v-if="userDetail?.avatarUri && isShowAvatar"
            :src="userDetail.avatarUri"
            @error="onAvatarError"
          />
          <div v-else class="avt-default">
            <vi-typography type="headline-xs">
              {{ userDetail?.username?.substring(0, 2) }}
            </vi-typography>
          </div>
        </div>
      </template>
      <template #username>{{ getUserFullName() }} </template>
      <template #tenant-name> {{ tenantDetail?.alias }} </template>

      <template #menu-user>
        <vi-user
          :user-name="userDetail?.username"
          :user-email="userDetail?.email"
          :fullname="getUserFullName()"
          :tenant-name="tenantDetail?.alias"
          :tenant-role="
            tenantDetail?.roleOfTheTenant.name
              ? $t(tenantDetail?.roleOfTheTenant.name)
              : ''
          "
          :avatar-uri="userDetail?.avatarUri"
          :text-logout="$t('common-profile-button-button_logout')"
          :nav-users="navUsers"
        />
      </template>
    </vi-menu>
    <div class="app-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import type {
  ITenantDetail,
  IUser,
  IUserInfoResponse,
} from '~/stores/interface/response/share';
import { useTenantStore } from '~/stores/tenant';
import { useUserStore } from '~/stores/user';

const { t } = useI18n();
const userDetail = ref<IUser>();
const tenantDetail = ref<ITenantDetail>();
const { getDetailInfoUser } = useUserStore();
const { getTenantByID } = useTenantStore();
const { getInfoUserFromCookie } = useAuthStore();

const isShowAvatar = ref(true);
const onAvatarError = () => {
  isShowAvatar.value = false;
};

const navOptions = [
  {
    id: 1,
    text: t('common-navigation-menu-section_apps'),
    nameIcon: 'ic_project',
    link: '/project-list',
  },
];
const navUsers = [
  {
    text: t('common-profile-button-button_general_setting'),
    nameIcon: 'ic_setting',
    link: '/switch-language',
  },
  {
    text: t('common-profile-button-button_account_setting'),
    nameIcon: 'ic_account_setting',
    link: '/user/profile',
  },
  {
    text: t('common-profile-button-button_switch_tenant'),
    nameIcon: 'ic_arrow_switch',
    link: '/tenant',
  },
];

const fetchCurrentUser = async () => {
  const response: IUserInfoResponse = await getDetailInfoUser();
  userDetail.value = response.data;
};

const fetchTenantInfo = async () => {
  const tenantId = getInfoUserFromCookie()?.tenant_id;
  if (tenantId) {
    const res = await getTenantByID(tenantId);
    tenantDetail.value = res.data;
  }
};

const getUserFullName = () => {
  return [
    userDetail?.value?.firstName || '',
    userDetail?.value?.lastName || '',
  ].join(' ');
};

onMounted(() => {
  fetchCurrentUser().then(() => {
    fetchTenantInfo();
  });
});
provide(PROVIDE.USER_INFO, userDetail);
</script>

<style lang="scss" scoped>
.layout-app {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(0deg, #030c11 0%, rgba(3, 12, 17, 0) 100%),
    linear-gradient(
      270deg,
      rgba(130, 136, 255, 0.4) 0%,
      rgba(90, 216, 255, 0.4) 50%,
      rgba(225, 96, 255, 0.4) 100%
    ),
    #030c11;
  .content {
    flex: 1;
    background-color: rgba(3, 12, 17, 0.6);
  }

  .navbar-left {
    color: #fff;
    height: 100vh;
    background: $neutral-white-alpha-7;
    backdrop-filter: blur(5px);
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      img {
        object-fit: contain;
        height: 100%;
        width: 100%;
      }
      .avt-default {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000 content-box;
        border-radius: 50%;
        border: 1px solid $neutral-white-alpha-10;
      }
    }
  }
  .app-content {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
    background: rgba(3, 12, 17, 0.6);
  }
  :deep() {
    .navigation.expand {
      width: calc(264 / 1440 * 100vw);
    }
  }

  :deep() {
    .navigation.expand {
      width: calc(264px / 1440px * 100vw);
    }
  }
}
</style>
