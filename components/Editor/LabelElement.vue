<template>
  <div
    v-show="isShow"
    ref="labelElementSelecting"
    class="label-element-selecting"
    :class="{
      'button-href':
        typeLabel.isButtonHref ||
        typeLabel.isLogo ||
        typeLabel.isImageRightSection ||
        typeLabel.isElementRest,
      'border-section':
        typeLabel.borderSection || typeLabel.isHeader || typeLabel.isFooter,
    }"
  >
    <div
      class="text-label"
      v-if="typeLabel.isLogo || typeLabel.isImageRightSection"
    >
      <vi-typography type="caption-large-300">
        {{ $t('landing-editor-section-section_media') }}
      </vi-typography>
    </div>
    <div class="text-label-header" v-if="typeLabel.isHeader">
      <vi-typography type="caption-large-300">
        {{ $t('landing-editor-field-header') }}
      </vi-typography>
    </div>
    <div class="text-label-footer" v-if="typeLabel.isFooter">
      <vi-typography type="caption-large-300">
        {{ $t('landing-editor-field-footer') }}
      </vi-typography>
    </div>
    <div class="text-label" v-if="typeLabel.isElementRest">
      <vi-typography type="caption-large-300">
        {{ $t('landing-editor-section-section_text') }}
      </vi-typography>
    </div>
    <div class="text-label" v-if="typeLabel.isButtonHref">
      <vi-typography type="caption-large-300">
        {{ $t('landing-editor-section-section_button') }}
      </vi-typography>
      <vi-icon
        v-if="objectSelecting?.link"
        name="ic_link"
        size="16"
        color="#fff"
      ></vi-icon>
    </div>
    <div class="text-label-section" v-if="typeLabel.borderSection">
      <vi-typography type="caption-large-300">
        {{ $t('landing-editor-menu-title_section') }}
      </vi-typography>
    </div>
    <div class="border-audio" v-if="typeLabel.isBorderAudio">
      <div class="wrap-label-audio">
        <div class="text-label-audio">
          <vi-typography type="caption-large-300">
            {{ $t('landing-editor-section-section_media') }}
          </vi-typography>
        </div>
        <div class="audio-box">
          <vi-icon name="ic_ai_section" size="16" color="#fff"></vi-icon>
          <vi-typography type="caption-large-300">
            {{ $t('landing-editor-section-ai_section_audio') }}
          </vi-typography>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILabelElement } from '~/types/common';
import type { BUTTON_EXTERNAL_ITEM } from '~/types/templates';

defineProps({
  typeLabel: {
    type: Object as PropType<ILabelElement>,
    default: () => ({}),
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  objectSelecting: {
    type: Object as PropType<BUTTON_EXTERNAL_ITEM>,
    default: () => ({}),
  },
});

const labelElementSelecting = ref<HTMLElement>();

const setPosition = (coordinates: DOMRect) => {
  if (!labelElementSelecting.value) return;
  labelElementSelecting.value.style.left = `${coordinates.left}px`;
  labelElementSelecting.value.style.top = `${coordinates.top}px`;
  labelElementSelecting.value.style.width = `${coordinates.width}px`;
  labelElementSelecting.value.style.height = `${coordinates.height}px`;
};

defineExpose({
  setPosition,
});
</script>
<style lang="scss" scoped>
.label-element-selecting {
  position: fixed;
  z-index: 10;
  pointer-events: none;
  &.button-href {
    border: 2px solid #1edd00;
  }
  &.border-section {
    border: 2px solid $brand-magenta-400-main;
  }
  .border-audio {
    width: 100%;
    margin-top: -20px;
    height: calc(100% + 20px);
    background-image: url(@/assets/images/border-audio.svg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    .wrap-label-audio {
      position: absolute;
      transform: translateY(-100%);
      top: 0;
      display: flex;
      align-items: center;
      gap: 2px;
      .text-label-audio {
        background-color: $brand-green-200-main;
        padding: 1px 6px;
      }
      .audio-box {
        padding: 1px 6px;
        display: flex;
        align-items: center;
        gap: 4px;
        background: linear-gradient(66deg, #0078d8 15.31%, #ff2cf0 84.69%);
      }
    }
  }
  .text-label,
  .text-label-section {
    display: flex;
    gap: 4px;
    align-items: center;
    background-color: $brand-green-200-main;
    padding: 1px 6px;
    position: absolute;
    transform: translate(-2px, -100%);
  }
  .text-label-section {
    background-color: $brand-magenta-400-main;
    right: 0;
    transform: translate(2px, -100%);
  }
  .text-label-header,
  .text-label-footer {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 1px 6px;
    position: absolute;
    background-color: $brand-magenta-400-main;
    bottom: 0;
    left: 0;
    transform: translate(-2px, 100%);
  }
  .text-label-footer {
    top: 0;
    bottom: unset;
    transform: translate(-2px, -100%);
  }
}
</style>
