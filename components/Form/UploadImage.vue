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
        >
          {{ $t('landing-project_mgmt-button-upload_image_button') }}
        </vi-button>
        <vi-typography class="description" type="caption-large-500">
          {{ description }}
        </vi-typography>
      </div>
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
      size: 15,
    }),
  },
  recommend: {
    type: Object,
    default: () => ({
      width: 1200,
      height: 628,
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

const description = `影像格式 : JPEG, PNG 
建議尺寸 : ${props.recommend.width} x ${props.recommend.height} 以上 
檔案最大限制 : ${props.limit.size} MB`;

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

    img.onload = () => {
      if (isSizeValid) {
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
          window.VIUIKit.VIMessage({
            title: t('error_fe-file-validation-file_size_exceeded'),
            width: '348px',
            type: 'error',
          });
        }
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
      object-fit: contain;
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
}
</style>
