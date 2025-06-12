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
        <vi-typography type="body-small"
          >已為你的音檔加入專屬六碼聲音標記（XXXXXX），你可以安心的創作(TBD)</vi-typography
        >
      </div>
      <vi-dropdown
        class="mt-24"
        v-model="audioSelecting.setting.voiceModelId"
        size="small"
        :label="$t('landing-editor-modal-tts_field_choice_voice')"
        :listOption="listModel"
      />
      <div class="box-adjust-speech">
        <vi-typography type="subtitle-small">{{
          $t('landing-editor-modal-tts_subtitle_speed')
        }}</vi-typography>
        <vi-progress
          v-model="audioSelecting.setting.speed"
          has-tick-mark
          is-show-legend
          progress-width="100%"
          type="dual-slider"
          :data="arraySpeed"
        />
        <vi-typography type="subtitle-small">{{
          $t('landing-editor-modal-tts_subtitle_pitch')
        }}</vi-typography>
        <vi-progress
          v-model="audioSelecting.setting.pitch"
          has-tick-mark
          is-show-legend
          progress-width="100%"
          type="dual-slider"
          :data="arrayPitch"
        />
      </div>

      <div class="box-demo">
        <vi-typography type="body-small">{{
          $t('landing-editor-modal-tts_preview_hint')
        }}</vi-typography>
        <div class="custom-audio">
          <vi-audio
            :audio-file="audioSelecting.setting.listPhrase?.[0]?.audioUrl"
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
            :label="
              $t('landing-editor-modal-tts_sentence_number', { num: index + 1 })
            "
            :is-count="true"
            :max="50"
            :placeholder="$t('landing-editor-modal-tts_placeholder_enter_text')"
            @change="() => handleCreateDemo(index)"
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
          <div class="audio-box">
            <div class="custom-audio">
              <vi-audio
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
  'change-align',
  'change-size',
  'close',
  'move-popup-to-top',
  'move-popup-to-bottom',
]);

const audioSelecting = defineModel<any>();
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

const mapSpeed = {
  慢: 0.5,
  中: 1,
  快: 1.5,
};
const mapPitch = {
  低: 0.5,
  中: 1,
  高: 1.5,
};

const arraySpeed = [0.5, 1, 1.5];
const arrayPitch = [0.5, 1, 1.5];

const itemPhrase = {
  text: '',
  audio: '',
  id: null,
};
const { getVoiceModelList, getListDemos, createDemo } = useEditorStore();

const listModel = ref<{ text: string; value: string }[]>([]);

const popupElement = ref<HTMLElement>();
const addPhrase = () => {
  audioSelecting.value.setting.listPhrase.push(_.cloneDeep(itemPhrase));
};
const handleDeletePhrase = (index: number) => {
  audioSelecting.value.setting.listPhrase.splice(index, 1);
};
const handleCreateDemo = _.debounce(async (index: number) => {
  if (!audioSelecting.value.setting.voiceModelId.value) return;
  try {
    audioSelecting.value.setting.listPhrase[index].isLoading = true;

    const res = await createDemo(
      audioSelecting.value.setting.voiceModelId.value as string,
      {
        pitch: audioSelecting.value.setting.pitch,
        speed: audioSelecting.value.setting.speed,
        text: audioSelecting.value.setting.listPhrase[index].text,
      }
    );
    audioSelecting.value.setting.listPhrase[index].id = res.data?.demoId;
    audioSelecting.value.setting.listPhrase[index].audioUrl = res.data?.demoUri;
  } catch (error) {
  } finally {
    audioSelecting.value.setting.listPhrase[index].isLoading = false;
  }
}, 1000);

const fetchListVoiceModel = async () => {
  const listModelApi = (await getVoiceModelList()).data;
  listModel.value = listModelApi.map((item: any) => ({
    text: item.name,
    value: item.id,
  }));
};

// watch(
//   () => audioSelecting.value?.setting?.voiceModelId.value,
//   async () => {
//     if (!audioSelecting.value?.setting?.voiceModelId.value) return;
//     const res = await getListDemos(
//       audioSelecting.value.setting.voiceModelId.value
//     );
//   }
// );

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
