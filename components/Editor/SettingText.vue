<template>
  <div
    ref="popupElement"
    class="popup-setting-text"
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
      <vi-icon name="ic_text" size="24" color="#fff"></vi-icon>
      <div class="ml-8 mr-auto neutral-white-alpha-90-text">
        <vi-typography type="subtitle-large">{{
          $t('landing-editor-modal-text_setting')
        }}</vi-typography>
      </div>
      <vi-icon
        class="neutral-white-alpha-60-text cursor-pointer"
        name="ic_close"
        size="24"
        @click="emit('close')"
      ></vi-icon>
    </div>
    <div class="box-setting">
      <div class="neutral-white-alpha-60-text">
        <vi-typography type="subtitle-large">{{
          $t('landing-editor-modal-text_field_align')
        }}</vi-typography>
      </div>
      <div class="list">
        <div class="item" @click="emit('change-align', 'left')">
          <vi-icon name="ic_align_left" color="#fff" size="24"></vi-icon>
        </div>
        <div class="item" @click="emit('change-align', 'center')">
          <vi-icon name="ic_align_center" color="#fff" size="24"></vi-icon>
        </div>
        <div class="item" @click="emit('change-align', 'right')">
          <vi-icon name="ic_align_right" color="#fff" size="24"></vi-icon>
        </div>
      </div>
      <div class="neutral-white-alpha-60-text mt-24">
        <vi-typography type="subtitle-large">{{
          $t('landing-editor-modal-text_field_size')
        }}</vi-typography>
      </div>
      <div
        @click="emit('change-size', '48px')"
        class="text-title neutral-white-alpha-40-text mt-16"
      >
        Title
      </div>
      <div @click="emit('change-size', '28px')" class="text-subtitle mt-12">
        Subtitle
      </div>
      <div
        @click="emit('change-size', '18px')"
        class="text-body neutral-white-alpha-40-text mt-12"
      >
        Body
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useCheckHeightPopup from '~/composables/checkHeightPopupSetting';

const emit = defineEmits([
  'change-align',
  'change-size',
  'close',
  'move-popup-to-top',
  'move-popup-to-bottom',
]);
const props = defineProps({
  positionControlCurrent: {
    type: Object as PropType<{ pageX: number; pageY: number }>,
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
.popup-setting-text {
  position: fixed;
  z-index: 20;
  width: 320px;
  padding-bottom: 16px;
  border-radius: 8px;
  border: 1px solid $neutral-white-alpha-10;
  background: $brand-navy-800;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25),
    0px 0px 4px 0px rgba(0, 0, 0, 0.15);
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
  .box-setting {
    padding: 16px;
    .list {
      display: flex;
      padding: 4px;
      align-items: center;
      gap: 12px;
      border-radius: 4px;
      border: 1px solid $neutral-white-alpha-7;
      background: $brand-navy-800;
      margin-top: 16px;
      .item {
        cursor: pointer;
        flex: 1;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        &:hover {
          background: $neutral-white-alpha-7;
        }
      }
    }
    .text-title,
    .text-subtitle,
    .text-body {
      font-family: Inter;
      font-style: normal;
      line-height: normal;
      cursor: pointer;
    }
    .text-title {
      font-size: 48px;
      font-weight: 700;
    }
    .text-subtitle {
      color: #fff;
      font-size: 28px;
      font-weight: 600;
    }
    .text-body {
      font-size: 18px;
      font-weight: 400;
    }
  }
}
</style>
