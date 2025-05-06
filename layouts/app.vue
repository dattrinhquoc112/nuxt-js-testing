<template>
  <div class="layout-app">
    <vi-menu class="navbar-left" :list-option="navOptions">
      <template #logo>
        <img src="@/assets/images/logo.png" alt="" />
      </template>
      <template #icon-right>
        <vi-icon name="ic_sidemenu" size="24" color="#fff" />
      </template>
      <template #icon-back>
        <img src="@/assets/images/logo.png" alt="" />
      </template>
      <template #avatar>
        <div class="avatar">
          <img
            v-if="userDetail?.avatarUri && isShowAvatar"
            :src="userDetail.avatarUri"
            @error="onAvatarError"
          />
          <vi-typography v-else type="headline-xs">
            {{ userDetail?.username?.substring(0, 2) }}
          </vi-typography>
        </div>
      </template>
      <template #username>
        <vi-typography class="ellipsis-text-line" type="subtitle-large">
          {{ getUserFullName() }}
        </vi-typography>
      </template>
      <template #tenant-name>
        <vi-typography class="ellipsis-text-line" type="caption-large-500">
          {{ tenantDetail?.alias }}
        </vi-typography>
      </template>

      <template #menu-user>
        <div class="menu-user" @click.stop>
          <nuxt-link class="user">
            <div class="avatar">
              <img
                v-if="userDetail?.avatarUri && isShowAvatar"
                :src="userDetail.avatarUri"
                @error="onAvatarError"
              />
              <vi-typography v-else type="headline-xs">
                {{ userDetail?.username?.substring(0, 2) }}
              </vi-typography>
            </div>
            <div class="wrap-info">
              <vi-typography
                class="user-name ellipsis-text-line"
                type="subtitle-large"
              >
                {{ getUserFullName() }}
              </vi-typography>
              <vi-typography
                class="user-email ellipsis-text-line"
                type="body-small"
                >{{ userDetail?.email }}
              </vi-typography>
            </div>
          </nuxt-link>
          <div class="info-tenant">
            <vi-typography class="info-tenant-name" type="caption-large-500">{{
              tenantDetail?.alias
            }}</vi-typography>
            <vi-typography
              class="info-tenant-role"
              language-input="zh"
              type="body-small"
              >{{
                tenantDetail?.roleOfTheTenant.name
                  ? $t(tenantDetail?.roleOfTheTenant.name)
                  : ''
              }}</vi-typography
            >
          </div>
          <div class="list-menu">
            <nuxt-link
              v-for="(item, indexSub) in navUsers"
              :to="item.link"
              :key="indexSub"
              class="item"
            >
              <vi-icon :name="item.nameIcon" size="24" color="#fff" />
              <vi-typography type="subtitle-large">{{
                item.text
              }}</vi-typography>
            </nuxt-link>
          </div>
          <nuxt-link class="logout" to="/auth/logout">
            <vi-typography type="subtitle-large">{{
              $t('common-profile-button-button_logout')
            }}</vi-typography>
          </nuxt-link>
        </div>
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
    nameIcon: 'ic_ai_apps',
    link: '/dashboard',
  },
  {
    id: 2,
    text: t('common-navigation-menu-section_tenant_mgmt'),
    nameIcon: 'ic_tanent_management',
    link: '/settings',
  },
  {
    id: 3,
    text: t('common-navigation-menu-section_plan_mgmt'),
    nameIcon: 'ic_plan',
    link: '/traffic-plan',
  },
  {
    id: 4,
    text: t('common-navigation-menu-section_faq'),
    nameIcon: 'ic_help',
    link: '/faq',
    style: {
      marginTop: 'auto',
    },
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
  try {
    const response: IUserInfoResponse = await getDetailInfoUser();
    userDetail.value = response.data;
  } catch (error) {
    window.VIUIKit.VIMessage({
      title: t('error_fe-system-general-system_operation_failed'),
      type: 'error',
      width: '348px',
    });
  }
};

const fetchTenantInfo = async () => {
  const tenantId = getInfoUserFromCookie()?.tenant_id;
  if (tenantId) {
    try {
      const res = await getTenantByID(tenantId);
      tenantDetail.value = res.data;
    } catch (error) {
      window.VIUIKit.VIMessage({
        title: t('error_fe-system-general-system_operation_failed'),
        type: 'error',
        width: '348px',
      });
    }
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
  display: flex;
  background-color: $brand-navy-900-main;
  height: 100vh;
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
  }
  .navbar-left {
    color: #fff;
    height: 100vh;
    .menu-user {
      width: 100%;
      box-sizing: border-box;
      padding: 16px;
      background-color: $brand-navy-800;
      border-radius: 8px;
      .user {
        display: flex;
        align-items: center;
        color: inherit;
        text-decoration: none;
        .avatar {
          min-width: 40px;
          max-width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
          border: 1px solid $neutral-white-alpha-10;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 50%;
          }
        }
        .wrap-info {
          flex: 1;
          .user-name {
            color: $white;
            width: calc(100% - 48px);
          }
          .user-email {
            color: $neutral-white-alpha-60;
            width: calc(100% - 48px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .info-tenant {
        padding: 4px 8px;
        background-color: $neutral-white-alpha-7;
        margin-top: 20px;
      }
      .list-menu {
        margin-top: 48px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .item {
          display: flex;
          padding: 12px;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          &:hover {
            background-color: $neutral-white-alpha-10;
          }
        }
      }
      .logout {
        display: block;
        margin-top: 36px;
        text-decoration: none;
        padding: 12px;
        color: inherit;
        &:hover {
          background-color: $neutral-white-alpha-10;
        }
      }
    }
  }
  .app-content {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
  }
}
</style>
