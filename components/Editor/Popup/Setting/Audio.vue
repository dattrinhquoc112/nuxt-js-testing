<template>
  <div
    v-if="audioSelecting?.setting"
    ref="popupElement"
    class="popup-setting-audio"
    :style="{
      visibility: isShow ? 'visible' : 'hidden',
      left: positionControlCurrent?.pageX
        ? `${positionControlCurrent?.pageX}px`
        : '',
    }"
  >
    <div class="header">
      <div class="box-ai-icon">
        <vi-icon name="ic_ai_section" size="16" color="#fff"></vi-icon>
      </div>
      <div class="ml-8 mr-auto neutral-white-alpha-90-text">
        <vi-typography type="subtitle-large">{{
          $t('landing-editor-section-title_audio_tts')
        }}</vi-typography>
      </div>
      <vi-icon
        class="neutral-white-alpha-60-text cursor-pointer"
        name="ic_close"
        size="24"
        @click="emit('close')"
      ></vi-icon>
    </div>
    <vi-scroll class="box-setting">
      <div class="title-setting">
        <vi-typography type="body-small">{{
          $t('landing-editor-modal-tts_description')
        }}</vi-typography>
      </div>
      <vi-dropdown
        class="mt-24"
        v-model="audioSelecting.setting.voiceModelId"
        size="small"
        :label="$t('landing-editor-modal-tts_field_choice_voice')"
        :listOption="listModel"
        :placeholder="$t('landing-editor-placeholder-placeholder_voice_model')"
      />
      <div class="box-adjust-speech">
        <vi-typography type="subtitle-small">{{
          $t('landing-editor-modal-tts_subtitle_speed')
        }}</vi-typography>
        <vi-progress
          :modelValue="mapSpeed[audioSelecting.setting.speed as keyof typeof mapSpeed]"
          @update:modelValue="(value:any) => updateSetting('speed', value)"
          :disabled="isDisabledAll"
          has-tick-mark
          is-show-legend
          progress-width="100%"
          type="dual-slider"
          :data="arraySpeed"
        />
        <vi-typography class="mt-24" type="subtitle-small">{{
          $t('landing-editor-modal-tts_subtitle_pitch')
        }}</vi-typography>
        <vi-progress
          :modelValue="mapPitch[audioSelecting.setting.pitch as keyof typeof mapPitch]"
          @update:modelValue="(value:any) => updateSetting('pitch', value)"
          :disabled="isDisabledAll"
          has-tick-mark
          is-show-legend
          progress-width="100%"
          type="dual-slider"
          :data="arrayPitch"
        />
      </div>

      <div class="box-demo" :class="{ disabled: isDisabledAll }">
        <vi-typography type="body-small">{{
          $t('landing-editor-modal-tts_preview_hint')
        }}</vi-typography>
        <div class="custom-audio">
          <vi-audio
            :audio-file="demoUri"
            width="100%"
            :show-timer="false"
            :is-show-audio-size="false"
            :show-file-info="false"
            :is-show-progress="false"
          />
        </div>
      </div>

      <div class="text-randomly">
        <vi-typography type="caption-large-500">{{
          $t('landing-editor-modal-tts_play_hint')
        }}</vi-typography>
      </div>

      <div class="list-phrase">
        <div
          v-for="(item, index) in audioSelecting.setting.listPhrase"
          :key="index"
          class="item-phrase"
        >
          <vi-input
            width="100%"
            v-model="item.text"
            type="textarea"
            size="large"
            :disabled="isDisabledAll"
            :label="
              $t('landing-editor-modal-tts_sentence_number', {
                num: $t(`${index + 1}`),
              })
            "
            :is-count="true"
            :max="300"
            :placeholder="$t('landing-editor-modal-tts_placeholder_enter_text')"
          >
            <template #end-label-icon>
              <vi-icon
                class="cursor-pointer"
                name="ic_close"
                color="#fff"
                size="16"
                @click.stop="() => handleDeletePhrase(index)"
              ></vi-icon>
            </template>
          </vi-input>
          <div class="audio-box" :class="{ disabled: isDisabledAll }">
            <div class="custom-audio">
              <vi-audio
                @click:play-icon.stop="handleCreateDemo(index)"
                :audio-file="item?.audioUrl"
                width="100%"
                :show-timer="false"
                :is-show-audio-size="false"
                :is-show-status="
                  audioSelecting.setting.listPhrase[index].isLoading
                "
                :is-show-control-buttons="
                  !audioSelecting.setting.listPhrase[index].isLoading
                "
                :show-file-info="false"
              />
            </div>
          </div>
        </div>
      </div>

      <vi-button
        v-show="audioSelecting.setting.listPhrase?.length < 5"
        @click="addPhrase"
        :disabled="isDisabledAll"
        class="mt-24"
        type="standard-default"
        size="small"
        width="100%"
        >{{ $t('landing-editor-modal-tts_add_sentence') }}</vi-button
      >
    </vi-scroll>
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref } from 'vue';
import useCheckHeightPopup from '~/composables/checkHeightPopupSetting';
import { useEditorStore } from '~/stores/editor';

const emit = defineEmits([
  'remove-material',
  'add-material',
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
const audioSelecting = defineModel<any>();
const isDisabledAll = computed(() => {
  return !audioSelecting.value?.setting?.voiceModelId?.value;
});
const { t } = useI18n();

const mapSpeed = {
  0.5: t('landing-editor-modal-tts_option_speed_slow'),
  1: t('landing-editor-modal-tts_option_normal'),
  1.5: t('landing-editor-modal-tts_option_speed_high'),
};
const mapPitch = {
  0.5: t('landing-editor-modal-tts_option_pitch_low'),
  1: t('landing-editor-modal-tts_option_normal'),
  1.5: t('landing-editor-modal-tts_option_pitch_high'),
};

const arraySpeed = [
  t('landing-editor-modal-tts_option_speed_slow'),
  t('landing-editor-modal-tts_option_normal'),
  t('landing-editor-modal-tts_option_speed_high'),
];
const arrayPitch = [
  t('landing-editor-modal-tts_option_pitch_low'),
  t('landing-editor-modal-tts_option_normal'),
  t('landing-editor-modal-tts_option_pitch_high'),
];

const itemPhrase = {
  text: '',
  audio: '',
  id: null,
};
const { getVoiceModelList, createDemo } = useEditorStore();

const listModel = ref<{ text: string; value: string; demoUri?: string }[]>([]);
const demoUri = ref<string>('');

const popupElement = ref<HTMLElement>();

const addPhrase = () => {
  audioSelecting.value.setting.listPhrase.push(_.cloneDeep(itemPhrase));
};

const updateSetting = (key: string, speed: any) => {
  const objMap = key === 'speed' ? mapSpeed : mapPitch;
  const entry = Object.entries(objMap).find(([_, value]) => value === speed);
  audioSelecting.value.setting[key] = entry?.[0];
};

const handleDeletePhrase = (index: number) => {
  emit(
    'remove-material',
    audioSelecting.value.setting.listPhrase.splice(index, 1)
  );
};
const handleCreateDemo = async (index: number) => {
  if (audioSelecting.value.setting.listPhrase[index].audioUrl) return;
  if (!audioSelecting.value.setting.voiceModelId.value) return;
  try {
    audioSelecting.value.setting.listPhrase[index].isLoading = true;

    const res = await createDemo(
      audioSelecting.value.setting.voiceModelId.value as string,
      {
        pitch: Number(audioSelecting.value.setting.pitch),
        speed: Number(audioSelecting.value.setting.speed),
        text: audioSelecting.value.setting.listPhrase[index].text,
      }
    );
    audioSelecting.value.setting.listPhrase[index].id = res.data?.demoId;
    audioSelecting.value.setting.listPhrase[index].audioUrl = res.data?.demoUri;
    emit('add-material', audioSelecting.value.setting.listPhrase[index]);
  } catch (error) {
  } finally {
    audioSelecting.value.setting.listPhrase[index].isLoading = false;
  }
};

const fetchListVoiceModel = async () => {
  const listModelApi = (await getVoiceModelList()).data;
  listModel.value = listModelApi.map((item: any) => ({
    text: item.name,
    value: item.id,
    demoUri: item.demoUri,
  }));
};

watch(
  () => audioSelecting.value?.setting?.voiceModelId.value,
  async () => {
    if (!audioSelecting.value?.setting?.voiceModelId.value) {
      demoUri.value = '';
      return;
    }
    demoUri.value =
      listModel.value.find(
        (item: any) =>
          item.value === audioSelecting.value.setting.voiceModelId.value
      )?.demoUri || '';
  },
  { immediate: true }
);

useCheckHeightPopup(props, popupElement, emit);

onMounted(() => {
  fetchListVoiceModel();
});
</script>

<style lang="scss" scoped>
.popup-setting-audio {
  position: fixed;
  z-index: 20;
  width: 322px;
  height: calc(100vh - 100px);
  padding-bottom: 16px;
  border-radius: 8px;
  border: 1px solid $neutral-white-alpha-10;
  background: $brand-navy-800;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25),
    0px 0px 4px 0px rgba(0, 0, 0, 0.15);
  transform: translateX(50%);
  top: 80px;
  .header {
    padding: 16px 16px 8px 16px;
    display: flex;
    align-items: center;
    width: 100%;
    .box-ai-icon {
      padding: 4px;
      border-radius: 8px;
      display: flex;
      background: linear-gradient(66deg, #0078d8 15.31%, #ff2cf0 84.69%);
    }
  }
  .box-setting {
    padding: 16px;
    height: calc(100% - 48px);
    :deep() {
      .group-dropdown {
        .select {
          .dropdown-menu {
            z-index: 5;
          }
        }
      }
    }
    .title-setting {
      padding: 8px 12px;
      border-radius: 4px;
      background: radial-gradient(
          474.15% 141.42% at 0% 100%,
          rgba(10, 147, 255, 0.2) 0%,
          rgba(255, 44, 240, 0) 100%
        ),
        linear-gradient(90deg, #030c11 0%, rgba(3, 12, 17, 0) 100%);
    }
    .box-adjust-speech {
      margin-top: 8px;
      padding: 12px 16px;
      border-radius: 4px;
      border: 1px solid $neutral-white-alpha-7;
      :deep() {
        .progress .list-legend .item {
          width: fit-content;
          text-align: center;
        }
      }
    }
    .box-demo {
      padding: 8px 12px 16px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      .custom-audio {
        margin-left: auto;
        :deep() {
          .player-container {
            gap: 0;
          }
        }
      }
      &.disabled {
        pointer-events: none;
        opacity: 0.5;
      }
    }
    .text-randomly {
      padding: 8px 12px;
      margin-top: 24px;
      margin-bottom: 24px;
      border-radius: 4px;
      background: radial-gradient(
          474.15% 141.42% at 0% 100%,
          rgba(10, 147, 255, 0.2) 0%,
          rgba(255, 44, 240, 0) 100%
        ),
        linear-gradient(90deg, #030c11 0%, rgba(3, 12, 17, 0) 100%);
    }
    .list-phrase {
      .item-phrase {
        margin-top: 24px;
        position: relative;
        :deep() {
          .input-wrapper {
            &:focus-within,
            &:hover {
              background-color: $neutral-white-alpha-7;
            }
            border: none;
          }
          .input-footer {
            padding: 0 12px;
          }
        }
        .audio-box {
          border-radius: 4px;
          background: $neutral-white-alpha-7;
          padding-top: 36px;
          margin-top: -24px;
          padding-bottom: 16px;
          padding-right: 12px;
          padding-left: 12px;
          &.disabled {
            pointer-events: none;
            opacity: 0.5;
          }
        }
      }
    }
    .custom-audio {
      :deep() {
        .player-container {
          display: flex;
          flex-direction: column;
          align-items: unset;
          width: 100%;
          gap: 8px;
          .progress-container {
            margin: 0;
          }
          .control-buttons {
            width: fit-content;
            margin-left: auto;
            button {
              margin-right: 0;
              img {
                width: 16px;
                height: 16px;
              }
            }
          }
          .status-container {
            width: 32px;
            height: 32px;
            justify-content: center;
            margin-left: auto;
            border-radius: 100px;
            background: $neutral-white-alpha-90;
            .spin-loading {
              background-color: transparent;
              .img-loading {
                width: 16px !important;
                height: 16px !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
