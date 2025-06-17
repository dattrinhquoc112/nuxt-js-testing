<template>
  <div class="upload-container">
    <vi-typography type="subtitle-small">
      {{ label }}
      {{ required ? '*' : '' }}
    </vi-typography>
    <div class="upload-content">
      <div class="image-preview">
        <div
          v-if="!model.imageURL || !model.isShowImage"
          class="none-image"
          :style="{
            height,
            width,
          }"
        />
        <img
          v-if="model.imageURL && model.isShowImage"
          :src="model.imageURL"
          alt="image"
          @error="onImageError"
          :style="{
            height,
            width,
          }"
        />
      </div>
      <div class="info-upload">
        <vi-button
          type-button="button"
          @click="selectImage"
          type="standard-default"
          size="small"
          width="81px"
          :disabled="disabled"
        >
          {{ $t('landing-project_mgmt-button-upload_image_button') }}
        </vi-button>
        <vi-typography class="description" type="caption-large-500">
          {{ description }}
        </vi-typography>
      </div>
    </div>
    <input ref="inputFileElement" type="file" hidden @change="onFileChange" />
  </div>
</template>
<script setup lang="ts">
interface Model {
  imageURL: string;
  fileInput: File | null;
  isShowImage: boolean;
}

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '100px',
  },
  width: {
    type: String,
    default: '200px',
  },
  limit: {
    type: Object,
    default: () => ({
      width: 1200,
      height: 628,
      size: 15,
    }),
  },
  imageModel: {
    type: Object as PropType<Model>,
    default: () => ({
      imageURL: '',
      fileInput: null,
      isShowImage: true,
    }),
  },
});
const emits = defineEmits(['change']);
const model = ref<Model>({
  imageURL: props.imageModel.imageURL,
  fileInput: props.imageModel.fileInput,
  isShowImage: props.imageModel.isShowImage,
});
const inputFileElement = ref<HTMLInputElement>();
const { t } = useI18n();

const description = t('landing-project_mgmt-description-image_requirements');

const selectImage = () => {
  inputFileElement.value?.click();
};
const onFileChange = (event: Event) => {
  const maxFileSize = props.limit.size * 1024 * 1024; // 2 MB (change as needed)
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0];
  if (!selected) return;

  if (selected?.type === 'image/png' || selected?.type === 'image/jpeg') {
    const img = new Image();
    const objectUrl = URL.createObjectURL(selected);
    const isSizeValid = selected.size <= maxFileSize;
    const isDimensionValid =
      img.width <= props.limit.width && img.height <= props.limit.height;

    img.onload = () => {
      if (isSizeValid && isDimensionValid) {
        model.value.fileInput = selected;
        model.value.imageURL = objectUrl;
        emits('change', {
          file: selected,
          url: objectUrl,
        });
      } else {
        URL.revokeObjectURL(objectUrl);
        target.value = '';
        if (!isSizeValid) {
          toastMessage(
            t('error_fe-file-validation-file_size_exceeded'),
            'error'
          );
        } else if (!isDimensionValid) {
          toastMessage(
            t('error_fe-file-validation-file_dimensions_exceeded'),
            'error'
          );
        }
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      target.value = '';
      toastMessage(
        t('error_fe-file-validation-file_format_unsupported'),
        'error'
      );
    };

    img.src = objectUrl;
  } else {
    toastMessage(
      t('error_fe-file-validation-file_format_unsupported'),
      'error'
    );
    target.value = '';
  }
};
function onImageError() {
  model.value.isShowImage = false;
}

watch(
  () => JSON.stringify(props.imageModel),
  () => {
    model.value = { ...props.imageModel };
  }
);
</script>
<style lang="scss" scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
  align-self: stretch;
}
.upload-content {
  display: flex;
  flex-direction: row;
  gap: 24px;
  .image-preview {
    background-color: $neutral-white-alpha-7;
    padding: 10px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      object-fit: fill;
    }
  }
  .info-upload {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  }
}
.description {
  color: $neutral-white-alpha-60;
  white-space: pre-wrap;
  word-break: normal;
}
</style>
