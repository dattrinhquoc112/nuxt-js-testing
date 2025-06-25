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
        <vi-typography type="subtitle-large">{{
          $t('landing-editor-modal-media_setting')
        }}</vi-typography>
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
        <div class="input-image">
          <img src="/assets/images/input_imgage.png" alt="" />
        </div>
        <div v-if="!isAudio && !isLogo" class="input-image">
          <img src="/assets/images/input_video.png" alt="" />
        </div>
      </div>
      <input ref="inputFile" type="file" @change="handleChange" hidden />
      <div v-if="errorMessage" class="system-danger-danger-text">
        <vi-typography type="caption-large-300">
          {{ errorMessage }}
        </vi-typography>
      </div>
      <div class="neutral-white-alpha-60-text mt-8">
        <vi-typography v-if="isAudio" type="body-small" class="text-des-media"
          >影像格式：JPEG, PNG</vi-typography
        >
        <vi-typography
          v-else-if="isLogo"
          type="body-small"
          class="text-des-media"
        >
          {{ $t('landing-editor-modal-media_logo_description') }}</vi-typography
        >
        <vi-typography v-else type="body-small" class="text-des-media">
          {{ $t('landing-editor-modal-media_description') }}
        </vi-typography>
      </div>
      <div class="box-button">
        <vi-button
          @click="
            () => {
              if (isExceedLimit) {
                emit('handle-show-pu-limit');
                return;
              }
              inputFile?.click();
            }
          "
          type="standard-default"
          size="small"
          >{{ $t('landing-editor-button-media_upload') }}</vi-button
        >
        <vi-button
          @click="$emit('reset-file')"
          type="dangerous-default"
          size="small"
          >{{ $t('common-action-button-button_delete') }}</vi-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useCheckHeightPopup from '~/composables/checkHeightPopupSetting';

const emit = defineEmits([
  'close',
  'change-image',
  'change-video',
  'reset-file',
  'handle-show-pu-limit',
]);

const props = defineProps({
  positionControlCurrent: {
    type: Object,
    default: () => ({}),
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  isLogo: {
    type: Boolean,
    default: false,
  },
  isAudio: {
    type: Boolean,
    default: false,
  },
  isExceedLimit: {
    type: Boolean,
    default: false,
  },
});
const inputFile = ref<HTMLElement>();
const popupElement = ref<HTMLElement>();
useCheckHeightPopup(props, popupElement, emit);
const errorMessage = ref<string>();
const { t } = useI18n();
const getAcceptFile = computed(() => {
  if (props.isAudio) {
    return 'image/jpeg, image/png';
  }
  if (props.isLogo) {
    return 'image/gif, image/jpeg, image/png';
  }
  return 'image/jpeg, image/png, video/mp4, video/quicktime';
});

const handleChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null;
  if (!file) return;

  const fileSize = file.size;
  const fileType = file.type;
  const objectUrl = URL.createObjectURL(file);

  const acceptedTypes = getAcceptFile.value
    .split(',')
    .map((type) => type.trim());

  if (!acceptedTypes.includes(fileType)) {
    errorMessage.value = t('error_fe-file-validation-file_format_unsupported');
    return;
  }

  if (props.isAudio) {
    if (fileSize > 500 * 1024) {
      errorMessage.value = t('error_fe-file-validation-file_size_exceeded');
    } else {
      errorMessage.value = '';
      emit('change-image', { objectUrl, file });
    }
    input.value = '';
    return;
  }

  if (props.isLogo) {
    if (fileSize > 100 * 1024) {
      errorMessage.value = t('error_fe-file-validation-file_size_exceeded');
    } else {
      errorMessage.value = '';
      emit('change-image', { objectUrl, file });
    }
    input.value = '';
    return;
  }

  if (fileType.startsWith('image')) {
    if (fileSize > 500 * 1024) {
      errorMessage.value = t('error_fe-file-validation-file_size_exceeded');
    } else {
      errorMessage.value = '';
      emit('change-image', { objectUrl, file });
    }
  } else if (fileType.startsWith('video')) {
    if (fileSize > 5 * 1024 * 1024) {
      errorMessage.value = t('error_fe-file-validation-file_size_exceeded');
    } else {
      errorMessage.value = '';
      emit('change-video', { objectUrl, file });
    }
  }
  input.value = '';
};
</script>

<style lang="scss" scoped>
.popup-setting-image {
  position: fixed;
  z-index: 30;
  width: 322px;
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
  &.box-image-right {
    transform: translateX(calc(-100% + 50px)) translateY(-50%);
  }
  &.box-image-left {
    transform: translateX(-32px) translateY(-50%);
  }
  &.for-box-logo {
    transform: translateX(-26px) translateY(0);
  }
  .header {
    padding: 16px 16px 8px 16px;
    display: flex;
    align-items: center;
    width: 100%;
  }
  .box-input {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 41px 28px 41px 24px;
    &:has(.input-image:nth-child(2)) {
      justify-content: space-between;
    }
    .input-image {
      display: flex;
    }
  }
  .text-des-media {
    white-space: pre-line;
  }
  .box-button {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    gap: 16px;
  }
}
</style>
