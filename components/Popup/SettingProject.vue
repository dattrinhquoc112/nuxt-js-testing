<template>
  <vi-modal
    :modal-title="$t('landing-project_mgmt-title-event_settings')"
    :is-show="show"
    @close="onClose"
    size="full-screen"
  >
    <vi-form :model="model" :rules="rules" @submit="() => {}">
      <div class="modal-content">
        <div class="section-column">
          <!-- <vi-typography class="color-white-60" type="subtitle-large">{{
            $t('landing-project_mgmt-section-event_time')
          }}</vi-typography> -->
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
                      :label="
                        $t('landing-project_mgmt-title-event_period_setting')
                      "
                      :placeholder="
                        $t('landing-project_mgmt-title-event_period_setting')
                      "
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
          <!-- <vi-typography class="color-white-60" type="subtitle-large">{{
            $t('landing-project_mgmt-section-url_section')
          }}</vi-typography> -->
          <div class="grid-two">
            <vi-form-item prop="eventEnglishName">
              <template #default="{ errorMsg }">
                <vi-input
                  v-model="model.eventEnglishName"
                  size="large"
                  type="text"
                  :label="$t('landing-project_mgmt-title-event_name_en')"
                  :placeholder="
                    $t(
                      'landing-project_mgmt-placeholder-placeholder_event_name_en'
                    )
                  "
                  required
                  width="100%"
                  :error="Boolean(errorMsg)"
                  :hint="errorMsg"
                />
              </template>
            </vi-form-item>
            <div class="url-preview">
              <vi-typography type="subtitle-large">{{
                $t('landing-project_mgmt-title-event_url')
              }}</vi-typography>
              <vi-typography>{{ getProjectUrl(props.project) }}</vi-typography>
            </div>
          </div>
        </div>
        <div class="section-column">
          <vi-typography class="color-white-60" type="subtitle-large">{{
            $t('landing-project_mgmt-section-seo_meta_section')
          }}</vi-typography>
          <div class="grid-two">
            <div class="section-column">
              <vi-form-item prop="metaTitle">
                <template #default="{ errorMsg }">
                  <vi-input
                    v-model="model.metaTitle"
                    size="large"
                    type="text"
                    :label="$t('landing-project_mgmt-title-meta_title')"
                    :placeholder="
                      $t(
                        'landing-project_mgmt-placeholder-placeholder_meta_title'
                      )
                    "
                    required
                    :max="60"
                    is-count
                    width="100%"
                    :error="Boolean(errorMsg)"
                    :hint="errorMsg"
                  />
                </template>
              </vi-form-item>
              <vi-form-item prop="metaDescription">
                <template #default="{ errorMsg }">
                  <vi-input
                    v-model="model.metaDescription"
                    size="large"
                    type="textarea"
                    :label="$t('landing-project_mgmt-title-meta_description')"
                    :placeholder="
                      $t(
                        'landing-project_mgmt-placeholder-placeholder_meta_description'
                      )
                    "
                    :max="155"
                    is-count
                    width="100%"
                    height="210px"
                    :error="Boolean(errorMsg)"
                    :hint="errorMsg"
                  />
                </template>
              </vi-form-item>
              <vi-form-item prop="metaKeyword">
                <template #default="{ errorMsg }">
                  <vi-input
                    v-model="model.metaKeyword"
                    size="large"
                    type="textarea"
                    :label="$t('landing-project_mgmt-title-meta_keyword')"
                    :placeholder="
                      $t(
                        'landing-project_mgmt-placeholder-placeholder_meta_keyword'
                      )
                    "
                    width="100%"
                    height="210px"
                    :error="Boolean(errorMsg)"
                    :hint="errorMsg"
                  />
                </template>
              </vi-form-item>
            </div>
            <div class="result-preview">
              <vi-typography
                :class="{
                  'color-white-60': !model.metaTitle,
                }"
                type="headline-xs"
                >{{
                  model.metaTitle || $t('landing-project_mgmt-title-meta_title')
                }}</vi-typography
              >
              <vi-typography
                :class="{
                  'color-white-60': !model.metaDescription,
                }"
                type="body-small"
                >{{
                  model.metaDescription ||
                  $t('landing-project_mgmt-title-meta_description')
                }}</vi-typography
              >
              <vi-typography
                :class="{
                  'color-white-60': !model.metaKeyword,
                }"
                type="body-small"
                >{{
                  model.metaKeyword ||
                  $t('landing-project_mgmt-title-meta_keyword')
                }}</vi-typography
              >
            </div>
          </div>
        </div>
        <div class="section-column">
          <vi-typography class="color-white-60" type="subtitle-large">{{
            $t('landing-project_mgmt-section-seo_og_section')
          }}</vi-typography>
          <div class="grid-two">
            <div class="section-column">
              <form-upload-image
                :imageModel="modelOGImage"
                @change="onChangeOGImage"
              />
              <vi-form-item prop="ogTitle">
                <template #default="{ errorMsg }">
                  <vi-input
                    v-model="model.ogTitle"
                    size="large"
                    type="text"
                    :label="$t('landing-project_mgmt-title-og_title')"
                    :placeholder="
                      $t(
                        'landing-project_mgmt-placeholder-placeholder_og_title'
                      )
                    "
                    required
                    :max="95"
                    is-count
                    width="100%"
                    :error="Boolean(errorMsg)"
                    :hint="errorMsg"
                  />
                </template>
              </vi-form-item>
              <vi-form-item prop="ogDescription">
                <template #default="{ errorMsg }">
                  <vi-input
                    v-model="model.ogDescription"
                    size="large"
                    type="textarea"
                    :label="$t('landing-project_mgmt-title-og_description')"
                    :placeholder="
                      $t(
                        'landing-project_mgmt-placeholder-placeholder_og_description'
                      )
                    "
                    :max="200"
                    is-count
                    width="100%"
                    height="210px"
                    :error="Boolean(errorMsg)"
                    :hint="errorMsg"
                  />
                </template>
              </vi-form-item>
            </div>
            <div class="result-preview">
              <div v-if="!model.ogImageUri" class="none-image" />
              <custom-image
                v-if="model.ogImageUri"
                class="og-image"
                :src="model.ogImageUri"
                alt="image"
              />
              <vi-typography
                :class="{
                  'color-white-60': !model.ogTitle,
                }"
                type="subtitle-large"
                >{{
                  model.ogTitle || $t('landing-project_mgmt-title-og_title')
                }}</vi-typography
              >
              <vi-typography
                :class="{
                  'color-white-60': !model.ogDescription,
                }"
                type="body-small"
                >{{
                  model.ogDescription ||
                  $t('landing-project_mgmt-title-og_description')
                }}</vi-typography
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
          @click="onEditProject"
          type="standard-primary"
          width="fit-content"
          :disabled="disabledSubmit()"
          >{{ $t('common-action-button-button_confirm.1') }}</vi-button
        >
        <vi-button
          type-button="button"
          @click="onClose"
          type="standard-default"
          width="fit-content"
          >{{ $t('common-action-button-button_cancel') }}</vi-button
        >
      </div>
    </template>
  </vi-modal>
</template>
<script lang="ts" setup>
import useProjects from '~/composables/projects';
import { useProjectStore } from '~/stores/project';
import { useUploadStore } from '~/stores/upload';
import type { IProject, IUpdateProjectPayload } from '~/types/project';

interface Model {
  dates: string[] | Date[] | number[];
  date: string;
  isShowDate: boolean;
  ogImageFile?: File;
  eventEnglishName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyword: string;
  ogTitle: string;
  ogImageUri: string;
  ogDescription: string;
  project?: IProject;
}

const { t } = useI18n();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Object as PropType<IProject>,
    default: undefined,
  },
});
const emit = defineEmits(['close', 'submit']);

const loading = reactive({
  update: false,
});

const model = reactive<Model>({
  dates: [new Date().toISOString(), new Date().toISOString()],
  date: '',
  isShowDate: false,
  eventEnglishName: '',
  metaTitle: '',
  metaDescription: '',
  metaKeyword: '',
  ogTitle: '',
  ogImageUri: '',
  ogDescription: '',
});

const modelOGImage = reactive<{
  imageURL: string;
  fileInput: File | null;
  isShowImage: boolean;
}>({
  imageURL: '',
  fileInput: null,
  isShowImage: true,
});

const disabledSubmit = () => {
  let isChanged = false;
  if (props.project) {
    const keys = [
      'eventEnglishName',
      'metaTitle',
      'metaDescription',
      'metaKeyword',
      'ogTitle',
      'ogImageUri',
      'ogDescription',
    ];
    isChanged =
      JSON.stringify(objectByKey(model, keys)) !==
      JSON.stringify(objectByKey(props.project, keys));
  }
  return (
    !(
      model.date &&
      model.eventEnglishName &&
      model.metaTitle &&
      model.ogTitle
    ) || !isChanged
  );
};

const rules = {
  date: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('landing-project_mgmt-title-event_period_setting'),
      }),
      trigger: 'change',
    },
  ],
  eventEnglishName: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('landing-project_mgmt-title-event_name_en'),
      }),
      trigger: 'change',
    },
    {
      regex: /^[a-z0-9\-._~]+$/,
      message: t('error_fe-data-validation-input_format_invalid'),
      trigger: 'change',
    },
  ],
  metaTitle: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('landing-project_mgmt-title-meta_title'),
      }),
      trigger: 'change',
    },
    {
      max: 60,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'change',
    },
  ],
  metaDescription: [
    {
      max: 155,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'change',
    },
  ],
  metaKeyword: [
    {
      regex:
        /^([\p{L}\p{N} .'&+/_-]{1,25})(,([\p{L}\p{N} .'&+/_-]{1,25})){0,9}$/u,
      message: t('error_fe-data-validation-input_format_invalid'),
      trigger: 'change',
    },
  ],
  ogTitle: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('landing-project_mgmt-title-og_title'),
      }),
      trigger: 'change',
    },
    {
      max: 95,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'change',
    },
  ],
  ogDescription: [
    {
      max: 200,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'change',
    },
  ],
};

const { getProjectUrl, getImage } = useProjects();
const { editProject } = useProjectStore();
const { uploadFile } = useUploadStore();

const onEditProject = async () => {
  if (props?.project?.id) {
    loading.update = true;
    const payload: IUpdateProjectPayload = {
      startTime: new Date(model.dates[0]).toISOString(),
      endTime: new Date(model.dates[1]).toISOString(),
      eventEnglishName: model.eventEnglishName,
      metaTitle: model.metaTitle,
      metaDescription: model.metaDescription,
      metaKeyword: model.metaKeyword,
      ogTitle: model.ogTitle,
      ogDescription: model.ogDescription,
      eventOfficialUrl: getProjectUrl({
        ...props.project,
        eventEnglishName: model.eventEnglishName,
      }),
    };
    if (model.ogImageFile) {
      const res = await uploadFile(model.ogImageFile);
      payload.ogImage = {
        thumbnail: res?.fileUri,
        fileUri: res?.fileUri,
        fileSize: model.ogImageFile.size,
      };
    }
    const res = await editProject(props.project?.id, payload);
    model.project = res.data;
    toastMessage(t('landing-common-message-saved'));
    loading.update = false;
  }
};

const onChangeOGImage = (obj: { url: string; file: File }) => {
  model.ogImageUri = obj.url;
  model.ogImageFile = obj.file;
};

const initProject = async () => {
  if (props.project) {
    model.project = props.project;
    if (props.project.startTime && props.project.endTime) {
      model.dates = [
        formatDate(props.project.startTime, 'YYYY/MM/DD HH:mm:ss'),
        formatDate(props.project.endTime, 'YYYY/MM/DD HH:mm:ss'),
      ];
    } else {
      const createdAt = new Date(props.project.createdAt);
      const plus30Days = new Date(
        createdAt.getTime() + 30 * 24 * 60 * 60 * 1000
      );
      model.dates = [
        formatDate(createdAt, 'YYYY/MM/DD HH:mm:ss'),
        formatDate(plus30Days, 'YYYY/MM/DD HH:mm:ss'),
      ];
    }
    model.eventEnglishName = props.project.eventEnglishName || '';
    model.metaTitle = props.project.metaTitle || '';
    model.metaDescription = props.project.metaDescription || '';
    model.metaKeyword = props.project.metaKeyword || '';
    model.ogTitle = props.project.ogTitle || '';
    model.ogDescription = props.project.ogDescription || '';
    // Image
    model.ogImageUri = getImage(props.project.ogImageUri);
    modelOGImage.imageURL = getImage(props.project.ogImageUri);
  }
};

const onClose = () => {
  emit('close', model.project);
};

onMounted(() => {
  initProject();
});

watch(
  () => props.project?.id,
  () => {
    initProject();
  }
);

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
    max-width: 100%;
    align-self: center;
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
