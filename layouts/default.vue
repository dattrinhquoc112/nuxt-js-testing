<template>
  <div class="default-container">
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
          <img src="@/assets/images/logo.png" />
        </div>
      </template>
      <template #username>
        <vi-typography class="ellipsis-text-line" type="subtitle-large">
          full name
        </vi-typography>
      </template>
      <template #tenant-name>
        <vi-typography class="ellipsis-text-line" type="caption-large-500">
          alias
        </vi-typography>
      </template>
    </vi-menu>
    <div class="content">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
const navOptions = [
  {
    id: 1,
    text: 'test 1',
    nameIcon: 'ic_ai_apps',
    link: '/dashboard',
  },
  {
    id: 2,
    text: 'test 2',
    nameIcon: 'ic_tanent_management',
    link: '/settings',
  },
  {
    id: 3,
    text: 'test 3',
    nameIcon: 'ic_plan',
    link: '/traffic-plan',
  },
];
</script>

<style lang="scss" scoped>
.default-container {
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

  :deep() {
    .navigation.expand {
      width: calc(264px / 1440px * 100vw);
    }
  }
}
</style>
