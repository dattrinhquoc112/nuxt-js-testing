<template>
  <vi-modal
    modal-title="編輯專案資訊"
    :is-show="show"
    @close="emit('close')"
    size="full-screen"
  >
    <vi-form :model="model" :rules="rules" @submit="() => {}">
      <div class="modal-content">
        <div class="section-column">
          <vi-typography class="color-white-60" type="subtitle-large"
            >活動時間</vi-typography
          >
          <div class="grid-two">
            <div class="section-column">
              <vi-date-picker
                class="w-full"
                v-model="model.dates"
                :is-open-date-picker="model.isShowDate"
                value-format="YYYY/MM/DD HH:mm:ss"
                type="daterange"
                @close="model.isShowDate = false"
                @accept="model.isShowDate = false"
              >
                <vi-form-item prop="date">
                  <template #default="{ errorMsg }">
                    <vi-input
                      :value="model.date"
                      size="large"
                      type="text"
                      label="活動上下線期間"
                      placeholder="Please input"
                      required
                      width="100%"
                      :error="Boolean(errorMsg)"
                      :hint="errorMsg"
                      @focus="model.isShowDate = true"
                    />
                  </template>
                </vi-form-item>
              </vi-date-picker>
            </div>
            <div class="section-column"></div>
          </div>
        </div>
        <div class="section-column">
          <vi-typography class="color-white-60" type="subtitle-large"
            >網址</vi-typography
          >
          <div class="grid-two">
            <vi-form-item prop="name">
              <template #default="{ errorMsg }">
                <vi-input
                  v-model="model.name"
                  size="large"
                  type="text"
                  label="活動英文名稱"
                  placeholder="請輸入活動英文名稱"
                  required
                  width="100%"
                  :error="Boolean(errorMsg)"
                  :hint="errorMsg"
                />
              </template>
            </vi-form-item>
            <div class="url-preview">
              <vi-typography type="subtitle-large">活動正式網址</vi-typography>
              <vi-typography
                >https://campaign-module.stockfeel.com.tw/eventpage/</vi-typography
              >
            </div>
          </div>
        </div>
        <div class="section-column">
          <vi-typography class="color-white-60" type="subtitle-large"
            >SEO-Meta</vi-typography
          >
          <div class="grid-two">
            <div class="section-column">
              <vi-form-item prop="seoMetaTitle">
                <template #default="{ errorMsg }">
                  <vi-input
                    v-model="model.seoMetaTitle"
                    size="large"
                    type="text"
                    label="Meta-Title"
                    placeholder="請輸入網頁標題"
                    required
                    width="100%"
                    :error="Boolean(errorMsg)"
                    :hint="errorMsg"
                  />
                </template>
              </vi-form-item>
              <vi-input
                v-model="model.seoMetaDescription"
                size="large"
                type="textarea"
                label="Meta-Description"
                placeholder="請輸入網頁搜尋到的簡介"
                width="100%"
                height="210px"
              />
              <vi-input
                v-model="model.seoMetaKeyword"
                size="large"
                type="textarea"
                label="Meta-Keyword"
                placeholder="請輸入 Meta Keyword"
                width="100%"
                height="210px"
              />
            </div>
            <div class="result-preview">
              <vi-typography
                :class="{
                  'color-white-60': !model.seoMetaTitle,
                }"
                type="headline-xs"
                >{{ model.seoMetaTitle || 'Meta title' }}</vi-typography
              >
              <vi-typography
                :class="{
                  'color-white-60': !model.seoMetaDescription,
                }"
                type="body-small"
                >{{
                  model.seoMetaDescription || 'Meta Description'
                }}</vi-typography
              >
              <vi-typography
                :class="{
                  'color-white-60': !model.seoMetaKeyword,
                }"
                type="body-small"
                >{{ model.seoMetaKeyword || 'Meta Keyword' }}</vi-typography
              >
            </div>
          </div>
        </div>
        <div class="section-column">
          <vi-typography class="color-white-60" type="subtitle-large"
            >SEO-OG</vi-typography
          >
          <div class="grid-two">
            <div class="section-column">
              <form-upload-image @change="onChangeOGImage" />
              <vi-form-item prop="seoOGTitle">
                <template #default="{ errorMsg }">
                  <vi-input
                    v-model="model.seoOGTitle"
                    size="large"
                    type="text"
                    label="OG-Title"
                    placeholder="請輸入社群分享的標題"
                    required
                    width="100%"
                    :error="Boolean(errorMsg)"
                    :hint="errorMsg"
                  />
                </template>
              </vi-form-item>
              <vi-input
                v-model="model.seoOGDescription"
                size="large"
                type="textarea"
                label="OG-Description"
                placeholder="請輸入社群分享的介紹顯示內容"
                width="100%"
                height="210px"
              />
            </div>
            <div class="result-preview">
              <div v-if="!model.seoOGImage" class="none-image" />
              <img
                v-if="model.seoOGImage"
                class="og-image"
                :src="model.seoOGImage"
                alt="image"
              />
              <vi-typography
                :class="{
                  'color-white-60': !model.seoOGTitle,
                }"
                type="subtitle-large"
                >{{ model.seoOGTitle || 'OG title' }}</vi-typography
              >
              <vi-typography
                :class="{
                  'color-white-60': !model.seoOGDescription,
                }"
                type="body-small"
                >{{ model.seoOGDescription || 'OG Description' }}</vi-typography
              >
            </div>
          </div>
        </div>
      </div>
    </vi-form>
    <template #footer>
      <div class="modal-footer">
        <vi-button
          type-button="button"
          @click="emit('submit')"
          type="standard-primary"
          width="fit-content"
          :disabled="disabledSubmit()"
          >{{ $t('common-action-button-button_confirm.1') }}</vi-button
        >
        <vi-button
          type-button="button"
          @click="emit('close')"
          type="standard-default"
          width="fit-content"
          >{{ $t('common-action-button-button_cancel') }}</vi-button
        >
      </div>
    </template>
  </vi-modal>
</template>
<script lang="ts" setup>
const { t } = useI18n();

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close', 'submit']);
const model = reactive({
  dates: [],
  date: '',
  isShowDate: false,
  name: '',
  seoMetaTitle: '',
  seoMetaDescription: '',
  seoMetaKeyword: '',
  seoOGTitle: '',
  seoOGImage: '',
  seoOGDescription: '',
});

const disabledSubmit = () => {
  return !(model.date && model.name && model.seoMetaTitle && model.seoOGTitle);
};

const rules = {
  date: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: '活動上下線期間',
      }),
      trigger: 'change',
    },
  ],
  name: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: '活動英文名稱',
      }),
      trigger: 'change',
    },
  ],
  seoMetaTitle: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: '活動英文名稱',
      }),
      trigger: 'change',
    },
  ],
  seoOGTitle: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: '活動英文名稱',
      }),
      trigger: 'change',
    },
  ],
};

const onChangeOGImage = (props: { url: string }) => {
  model.seoOGImage = props.url;
};

watch(
  () => model.dates,
  () => {
    model.date = model.dates.join(' - ');
  },
  { deep: true }
);
</script>
<style lang="scss" scoped>
.modal-footer {
  display: flex;
  flex-direction: row-reverse;
  gap: 16px;
}
.modal-content {
  padding-top: 12px;
  padding-bottom: 8px;
  white-space: pre-wrap;
}
.grid-two {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}
.section-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.url-preview {
  display: flex;
  padding: 12px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  border-radius: 4px;
  border: 1px solid $neutral-white-alpha-10;
}
.result-preview {
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 4px;
  border: 1px solid $neutral-white-alpha-10;
  height: fit-content;
  .og-image {
    width: 100%;
    object-fit: contain;
  }
  .none-image {
    height: 167px;
    width: 100%;
    background-color: $neutral-white-alpha-7;
  }
}
.w-full {
  width: 100% !important;
}
.color-white-60 {
  color: $neutral-white-alpha-60 !important;
}
</style>
