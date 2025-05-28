<template>
  <div
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
        <vi-typography type="subtitle-large">Audio TTS</vi-typography>
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
        v-model="sizeValue"
        size="small"
        label="聲音選擇"
        :listOption="dropdownOptions"
      />
      <div class="box-adjust-speech">
        <vi-typography type="subtitle-small">調節語速</vi-typography>
        <vi-progress
          v-model="dualSlider"
          has-tick-mark
          is-show-legend
          progress-width="100%"
          type="dual-slider"
          :data="arrayExample"
        />
        <vi-typography type="subtitle-small">調節語速</vi-typography>
        <vi-progress
          v-model="dualSlider"
          has-tick-mark
          is-show-legend
          progress-width="100%"
          type="dual-slider"
          :data="arrayExample"
        />
      </div>

      <div class="box-demo">
        <vi-typography type="body-small"
          >AI Clone 預設文案提示文字內容AI Clone 預設文案提示文字內容AI Clone
          預設文案提示文字內容</vi-typography
        >
        <editor-icon-play />
      </div>

      <div class="text-randomly">
        <vi-typography type="caption-large-500"
          >設定的語句將被隨機播放</vi-typography
        >
      </div>

      <div class="list-phrase">
        <div
          v-for="(item, index) in listPhrase"
          :key="index"
          class="item-phrase"
        >
          <vi-input
            width="100%"
            v-model="item.text"
            type="textarea"
            size="large"
            label="語句一"
            :is-count="true"
            :max="50"
            end-label-icon="ic_close"
            placeholder="請輸入語句"
          />
          <div class="audio-box">
            <vi-progress
              v-model="singerSlider"
              type="single-slider"
              :data="arrayExample2"
            />
            <editor-icon-play />
          </div>
        </div>
      </div>

      <vi-button
        @click="addPhrase"
        class="mt-24"
        type="standard-default"
        size="small"
        width="100%"
        >新增語句</vi-button
      >
    </vi-scroll>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useCheckHeightPopup from '~/composables/checkHeightPopupSetting';

const dualSlider = ref('中');
const singerSlider = ref(40);
const arrayExample2 = new Array(100).fill('').map((_, index) => index + 1);
const arrayExample = ['慢', '中', '快'];
const itemPhrase = {
  text: '',
  audio: '',
};
const listPhrase = ref([JSON.parse(JSON.stringify(itemPhrase))]);

const emit = defineEmits([
  'change-align',
  'change-size',
  'close',
  'move-popup-to-top',
  'move-popup-to-bottom',
]);

const dropdownOptions = ref([
  { text: 'item 1', value: 'value 1' },
  { text: 'item 2', value: 'value 2' },
  { text: 'item 3', value: 'value 3' },
  { text: 'item 4', value: 'value 4' },
  { text: 'item 5', value: 'value 5' },
]);
const sizeValue = ref('value 1');

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
const addPhrase = () => {
  listPhrase.value.push(JSON.parse(JSON.stringify(itemPhrase)));
};
useCheckHeightPopup(props, popupElement, emit);
</script>

<style lang="scss" scoped>
.popup-setting-audio {
  position: fixed;
  z-index: 20;
  width: 320px;
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
          padding-top: 24px;
          margin-top: -24px;
          padding-bottom: 16px;
          padding-right: 12px;
          padding-left: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }
      }
    }
  }
}
</style>
