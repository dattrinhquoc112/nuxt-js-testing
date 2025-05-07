<template>
  <div class="editor-bg">
    <NavigatorEditor />
    <div>
      <SideBarEditor />
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import NavigatorEditor from '@/components/Editor/LayoutEditor/components/NavigatorEditor.vue';
import SideBarEditor from '@/components/Editor/LayoutEditor/components/SideBarEditor.vue';
</script>

<style lang="scss" scoped>
.editor-bg {
  background: linear-gradient(0deg, #030c11 0%, rgba(3, 12, 17, 0) 100%),
    linear-gradient(
      270deg,
      rgba(130, 136, 255, 0.4) 0%,
      rgba(90, 216, 255, 0.4) 50%,
      rgba(225, 96, 255, 0.4) 100%
    ),
    var(--Brand-Navy-900-Main, #030c11);
}
</style>
