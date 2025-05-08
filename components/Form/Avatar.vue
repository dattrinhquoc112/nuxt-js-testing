<template>
  <div class="form-avatar mt-36 pb-24">
    <vi-typography type="subtitle-small">
      {{ $t('common-form-field-field_avatar') }}
    </vi-typography>
    <div class="group-avatar mt-16">
      <div class="avatar-img">
        <img
          v-if="model.avatar && isShowAvatar"
          :src="model.avatar"
          alt="avatar"
          @error="onAvatarError"
        />
        <vi-typography v-else type="headline-xs">
          {{ model.userName.substring(0, 2) }}
        </vi-typography>
      </div>
      <div class="info-upload">
        <vi-button
          type-button="button"
          @click="selectImage"
          type="standard-default"
          size="small"
          width="81px"
        >
          {{ $t('common-action-button-button_upload_avatar') }}
        </vi-button>
        <vi-typography class="description mt-8" type="caption-large-500">
          {{ $t('common-action-button-info_upload_avatar') }}
        </vi-typography>
      </div>
    </div>
    <div class="mt-24">
      <vi-form-item prop="userName">
        <template #default="{ errorMsg }">
          <vi-input
            v-model="model.userName"
            width="100%"
            :placeholder="$t('common-form-field-field_nickname')"
            :label="$t('common-form-field-field_nickname')"
            required
            :error="Boolean(errorMsg)"
            :hint="errorMsg"
            is-count
            :max="50"
            @keydown="onKeyDown"
          />
        </template>
      </vi-form-item>
    </div>
    <input
      ref="inputFileElement"
      type="file"
      accept=".png, .jpg, image/png, image/jpeg"
      hidden
      @change="onFileChange"
    />
  </div>
</template>
<script setup lang="ts">
import type { IUserNameAndAvatar } from '@/types/common';

const model = defineModel<IUserNameAndAvatar>({
  default: {},
});
const inputFileElement = ref<HTMLInputElement>();
const isShowAvatar = ref(true);
const { t } = useI18n();

const selectImage = () => {
  inputFileElement.value?.click();
};
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0];
  if (!selected) return;

  if (selected?.type === 'image/png' || selected?.type === 'image/jpeg') {
    const img = new Image();
    const objectUrl = URL.createObjectURL(selected);
    img.onload = () => {
      if (img.width <= 200 && img.height <= 200) {
        model.value.fileInput = selected;
        model.value.avatar = objectUrl;
      } else {
        URL.revokeObjectURL(objectUrl);
        target.value = '';
        window.VIUIKit.VIMessage({
          title: t('error_fe-file-validation-file_format_unsupported'),
          width: '348px',
          type: 'error',
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      target.value = '';
      window.VIUIKit.VIMessage({
        title: t('error_fe-file-validation-file_format_unsupported'),
        width: '348px',
        type: 'error',
      });
    };

    img.src = objectUrl;
  } else {
    window.VIUIKit.VIMessage({
      title: t('error_fe-file-validation-file_format_unsupported'),
      width: '348px',
      type: 'error',
    });
    target.value = '';
  }
};
function onAvatarError() {
  isShowAvatar.value = false;
}
const onKeyDown = (event: KeyboardEvent) => {
  if (/^[a-zA-Z0-9 ]$/.test(event.key)) return;
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'Enter',
  ];
  if (allowedKeys.includes(event.key)) return;
  event.preventDefault();
};
</script>
<style lang="scss" scoped>
.form-avatar {
  .group-avatar {
    display: flex;
    column-gap: 24px;
    align-items: center;
    .avatar-img {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid $neutral-white-alpha-10;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 50%;
      }
    }
    .info-upload {
      button {
        border-radius: 4px;
        padding: 6px 12px;
      }
      .description {
        color: $neutral-white-alpha-60;
      }
    }
  }
}
</style>
