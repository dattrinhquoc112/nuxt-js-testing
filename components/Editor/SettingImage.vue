<template>
  <div
    ref="popupElement"
    class="popup-setting-image"
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
      <vi-icon name="ic_picture" size="24" color="#fff"></vi-icon>
      <div class="ml-8 mr-auto neutral-white-alpha-90-text">
        <vi-typography type="subtitle-large">Media Setting</vi-typography>
      </div>
      <vi-icon
        class="neutral-white-alpha-60-text cursor-pointer"
        name="ic_close"
        size="24"
        @click="emit('close')"
      ></vi-icon>
    </div>
    <div class="pa-16">
      <div class="box-input">
        <div class="input-image" @click="inputImage?.click()">
          <input
            ref="inputImage"
            accept=".png, .jpg, image/png, image/jpeg"
            type="file"
            hidden
            @change="onImageChange"
          />
          <img src="/assets/images/input_imgage.png" alt="" />
        </div>
        <div class="input-image" @click="inputVideo?.click()">
          <input ref="inputVideo" type="file" hidden @change="onVideoChange" />
          <img src="/assets/images/input_video.png" alt="" />
        </div>
      </div>
      <div class="neutral-white-alpha-60-text mt-8">
        <vi-typography type="body-small"
          >影像格式 : JPEG, PNG, MP4, MOV</vi-typography
        >
      </div>
      <div class="box-button">
        <vi-button type="standard-default">上傳</vi-button>
        <vi-button type="dangerous-default">刪除</vi-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useCheckHeightPopup from '~/composables/checkHeightPopupSetting';

const emit = defineEmits(['close', 'change-image', 'change-video']);

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
const inputImage = ref<HTMLElement>();
const inputVideo = ref<HTMLElement>();
const popupElement = ref<HTMLElement>();
useCheckHeightPopup(props, popupElement, emit);

const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0];
  if (!selected) return;
  if (selected?.type === 'image/png' || selected?.type === 'image/jpeg') {
    const objectUrl = URL.createObjectURL(selected);
    emit('change-image', { objectUrl, file: selected });
    target.value = '';
  }
};
const onVideoChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0];
  if (!selected) return;
  // if (selected?.type === 'image/png' || selected?.type === 'image/jpeg') {
  const objectUrl = URL.createObjectURL(selected);
  emit('change-video', { objectUrl, file: selected });
  target.value = '';
  // }
};
</script>

<style lang="scss" scoped>
.popup-setting-image {
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
  &.for-bg-section {
    transform: translateX(calc(-100% + 56px));
  }
  &.for-box-image {
    transform: translateX(calc(-100% + 32px)) translateY(-50%);
  }
  .header {
    padding: 16px 16px 8px 16px;
    display: flex;
    align-items: center;
    width: 100%;
  }
  .box-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 41px 28px 41px 24px;
    .input-image {
      display: flex;
      cursor: pointer;
    }
  }
  .box-button {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    gap: 16px;
  }
}
</style>
