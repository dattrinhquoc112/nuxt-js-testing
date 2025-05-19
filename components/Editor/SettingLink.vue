<template>
  <div
    ref="popupElement"
    class="popup-setting-link"
    :style="{
      visibility: isShow ? 'visible' : 'hidden',
      left: positionControlCurrent?.pageX
        ? `${positionControlCurrent?.pageX}px`
        : '',
      top: positionControlCurrent?.pageY
        ? `${positionControlCurrent?.pageY}px`
        : '',
    }"
  >
    <div class="header">
      <vi-icon name="ic_link" size="24" color="#fff"></vi-icon>
      <div class="ml-8 mr-auto neutral-white-alpha-90-text">
        <vi-typography type="subtitle-large">Link Setting</vi-typography>
      </div>
      <vi-icon
        class="neutral-white-alpha-60-text cursor-pointer"
        name="ic_close"
        size="24"
        @click="emit('close')"
      ></vi-icon>
    </div>
    <div class="pa-16">
      <vi-input
        v-model.trim="link"
        width="100%"
        placeholder="請貼上網址連結"
        size="small"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useCheckHeightPopup from '~/composables/checkHeightPopupSetting';

const emit = defineEmits([
  'close',
  'move-popup-to-top',
  'move-popup-to-bottom',
  'change-link',
]);
const link = ref();

watch(link, () => {
  // handle validate link
  emit('change-link', link.value);
});

const props = defineProps({
  positionControlCurrent: {
    type: Object,
    default: () => ({}),
  },
  isShow: {
    type: Boolean,
    default: false,
  },
});
const popupElement = ref<HTMLElement>();
useCheckHeightPopup(props, popupElement, emit);
</script>

<style lang="scss" scoped>
.popup-setting-link {
  position: fixed;
  z-index: 20;
  width: 320px;
  padding-bottom: 16px;
  border-radius: 8px;
  border: 1px solid $neutral-white-alpha-10;
  background: $brand-navy-800;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25),
    0px 0px 4px 0px rgba(0, 0, 0, 0.15);
  :deep() {
    .input-container {
      gap: 0;
      .input-footer {
        display: none;
      }
    }
  }
  &.show-on-top {
    transform: translateX(-50%) translateY(-100%);
  }
  &.show-on-bottom {
    transform: translateX(-50%);
  }
  .header {
    padding: 16px 16px 8px 16px;
    display: flex;
    align-items: center;
    width: 100%;
  }
}
</style>
