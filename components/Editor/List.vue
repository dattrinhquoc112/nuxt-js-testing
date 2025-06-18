<template>
  <div id="editor">
    <div
      v-for="(section, index) in sections"
      :key="index"
      class="section"
      :class="sectionClass(index)"
      @mousemove="onHoverSection($event, index)"
      @mouseleave="hoverPosition = null"
    >
      <span
        v-if="templateSelected?.id && hoverPosition?.index === index"
        class="zone-label"
        :class="hoverPosition.zone"
        @click="emit('add-section', index)"
      >
        {{ $t('landing-editor-section-add_section') }}
      </span>

      <div
        v-if="templateSelected?.id && hoverPosition?.index === index"
        class="hover-zone"
        :class="hoverPosition.zone"
      ></div>
      <editor-section-render
        :section="section"
        :rwd-mode="rwdMode"
        @show-option="(event) => handleShowOption(event, index)"
        @handle-change-text="(event) => emit('handle-change-text', event)"
      />
    </div>
    <div
      v-show="isShowLabelElement"
      ref="labelElementSelecting"
      class="label-element-selecting"
      :class="{
        'button-href': typeLabel.isButtonHref,
        'border-audio': typeLabel.isBorderAudio,
      }"
    >
      <div class="text-label" v-if="typeLabel.isButtonHref">
        <vi-typography type="caption-large-300">
          {{ $t('landing-editor-section-section_button') }}
        </vi-typography>
        <vi-icon name="ic_link" size="16" color="#fff"></vi-icon>
      </div>
      <div class="border-audio" v-if="typeLabel.isBorderAudio">
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

<script lang="ts" setup>
import useCheckPermission from '~/composables/checkPermission';
import { RWD_MODE } from '~/constants/common';

const props = defineProps({
  templateSelected: {
    type: Object,
    default: () => ({}),
  },
  sections: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  classElementSelected: {
    type: String,
    default: '',
  },
  rwdMode: {
    type: String,
    default: '',
  },
});
const emit = defineEmits([
  'add-section',
  'set-position-control',
  'set-show-control',
  'hidden-all-popup-setting',
  'set-class-element-selected',
  'set-key-element-selected',
  'set-index-section-selected',
  'set-selected-element',
  'handle-change-text',
  'set-hover-position',
  'set-index-audio',
]);

const isShowLabelElement = ref<Boolean>(false);
const elementSelected = ref<HTMLElement>();
const labelElementSelecting = ref<HTMLElement>();
const typeLabel = ref({
  isButtonHref: false,
  isBorderAudio: false,
});
const hoverPosition = ref<{ index: number; zone: string } | null>(null);
const boxControlElement = computed(() =>
  document.getElementById('boxControlElement')
);
const { PERMISSION } = useCheckPermission();

const isDisabledEditor = computed(() => {
  return props.rwdMode === RWD_MODE.MOBILE || !PERMISSION.value.isEditor;
});

const onHoverSection = (e: MouseEvent, index: number) => {
  if (isDisabledEditor.value) return;
  if (!props.templateSelected) return;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const halfway = rect.top + rect.height / 2;
  let zone = '';
  if (index === 0) {
    zone = 'bottom';
  } else if (index === props.sections.length - 1) {
    zone = 'top';
  } else {
    zone = e.clientY < halfway ? 'top' : 'bottom';
  }
  hoverPosition.value = { index, zone };
  emit('set-hover-position', hoverPosition.value);
};

const sectionClass = (index: number) => {
  return {
    'hover-top':
      props.templateSelected?.id &&
      hoverPosition.value?.index === index &&
      hoverPosition.value.zone === 'top',
    'hover-bottom':
      props.templateSelected?.id &&
      hoverPosition.value?.index === index &&
      hoverPosition.value.zone === 'bottom',
    hover: !props.templateSelected?.id && hoverPosition.value?.index === index,
  };
};

const hiddenBoxControl = () => {
  emit('set-show-control', false);
  emit('hidden-all-popup-setting');
};
const hiddenBoxControlWhenClick = (event: MouseEvent) => {
  const listClassNotHide = [
    'section-wrap',
    'box-control',
    'popup-setting-text',
    'popup-setting-link',
    'popup-setting-color',
    'popup-setting-image',
    'popup-setting-audio',
  ];
  if (
    listClassNotHide.some((itemClass) =>
      (event.target as HTMLElement).closest(`.${itemClass}`)
    )
  ) {
    return;
  }

  hiddenBoxControl();
  boxControlElement.value?.classList.remove(
    `for-${props.classElementSelected}`
  );
  window.removeEventListener('click', hiddenBoxControlWhenClick);
};

const handleSetPosition = (
  elementButton: HTMLElement,
  callBackCalcPosition: Function
) => {
  if (!boxControlElement.value) return;
  emit('hidden-all-popup-setting');
  boxControlElement.value.setAttribute('class', 'box-control');
  boxControlElement.value.classList.add(`for-${props.classElementSelected}`);

  const coordinates = elementButton.getBoundingClientRect();
  const { pageX, pageY } = callBackCalcPosition(coordinates);
  emit('set-position-control', {
    pageY,
    pageX,
  });
  emit('set-show-control', true);

  window.addEventListener('click', hiddenBoxControlWhenClick);
};

const getPositionForButtonHref = (coordinates: any) => {
  const pageY = coordinates.bottom + 12;
  const pageX = coordinates.left + coordinates.width / 2;
  return { pageY, pageX };
};

const getPositionForSection = (coordinates: any) => {
  if (!boxControlElement.value) return;
  const heightBoxControl = boxControlElement.value.clientHeight
    ? boxControlElement.value.clientHeight / 2
    : 0;
  const pageY = coordinates.height / 2 - heightBoxControl + coordinates.top;
  const pageX = coordinates.width - 60 + coordinates.left;
  return { pageX, pageY };
};

const getPositionForSectionLogo = (coordinates: any) => {
  const pageY = coordinates.bottom;
  const pageX = coordinates.left + coordinates.width / 2;
  return { pageX, pageY };
};

const getPositionForSectionCopyright = (coordinates: any) => {
  const pageY = coordinates.top - 48;
  const pageX = coordinates.left + coordinates.width / 2;
  return { pageX, pageY };
};

const getPositionForImageLogo = (coordinates: any) => {
  const pageY = coordinates.bottom;
  const pageX = coordinates.left + coordinates.width / 2;
  return { pageX, pageY };
};

const getPositionForAudioImage = (coordinates: any) => {
  const pageY = coordinates.bottom + 12;
  const pageX = coordinates.left + coordinates.width / 2;
  return { pageX, pageY };
};

const getPositionForText = (coordinates: any) => {
  const pageY = coordinates.bottom + 12;
  const pageX = coordinates.left + coordinates.width / 2;
  return { pageX, pageY };
};

const getPositionForRightImage = (coordinates: any) => {
  const pageY = coordinates.bottom - coordinates.height / 2;
  const pageX = coordinates.left - 10;
  return { pageY, pageX };
};

const getPositionForLeftImage = (coordinates: any) => {
  const pageY = coordinates.bottom - coordinates.height / 2;
  const pageX = coordinates.right - 40;
  return { pageY, pageX };
};

const calcPositionLabel = (target: HTMLElement | null = null) => {
  if (!labelElementSelecting.value) return;
  let coordinates: DOMRect | undefined;
  if (target) {
    coordinates = target.getBoundingClientRect();
  } else if (elementSelected.value) {
    coordinates = elementSelected.value.getBoundingClientRect();
  } else {
    return;
  }
  if (labelElementSelecting.value && coordinates) {
    labelElementSelecting.value.style.left = `${coordinates.left}px`;
    labelElementSelecting.value.style.top = `${coordinates.top}px`;
    labelElementSelecting.value.style.width = `${coordinates.width}px`;
    labelElementSelecting.value.style.height = `${coordinates.height}px`;
  }
};

const handleSetLabel = (target: HTMLElement) => {
  if (!target) return;
  isShowLabelElement.value = true;
  typeLabel.value.isBorderAudio = false;
  typeLabel.value.isButtonHref = false;
  if (target.classList.contains('button-href')) {
    typeLabel.value.isButtonHref = true;
  } else if (target.closest('.audio-image')) {
    typeLabel.value.isBorderAudio = true;
  }
  calcPositionLabel(target);
};

const handleShowOption = (event: any, index: number) => {
  if (isDisabledEditor.value) return;
  if (event.target?.closest('.section-wrap')) {
    handleSetLabel(event.target);
    emit('set-index-section-selected', index);
    elementSelected.value = event.target;
    emit('set-selected-element', event.target);
    if (event.target?.classList.contains('section-wrap')) {
      if (event.target?.classList.contains('section-logo')) {
        emit('set-class-element-selected', 'section-logo');
        emit('set-key-element-selected', 'logo');
        nextTick(() => {
          handleSetPosition(event.target, getPositionForSectionLogo);
        });
      } else if (event.target?.classList.contains('section-copyright')) {
        emit('set-class-element-selected', 'section-copyright');
        emit('set-key-element-selected', 'copyright');
        nextTick(() => {
          handleSetPosition(event.target, getPositionForSectionCopyright);
        });
      } else {
        emit('set-class-element-selected', 'section-wrap');
        emit('set-key-element-selected', 'backgroundSection');
        nextTick(() => {
          handleSetPosition(event.target, getPositionForSection);
        });
      }
    }
    if (event.target?.classList.contains('section-logo-image')) {
      emit('set-class-element-selected', 'section-logo-image');
      emit('set-key-element-selected', 'logo');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForImageLogo);
      });
    }
    if (event.target?.classList.contains('button-href')) {
      emit('set-class-element-selected', 'button-href');
      emit('set-key-element-selected', 'buttonExternal');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForButtonHref);
      });
    }
    if (event.target?.classList.contains('text-title')) {
      emit('set-class-element-selected', 'text-title');
      emit('set-key-element-selected', 'textTitle');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForText);
      });
    }
    if (event.target?.classList.contains('text-head')) {
      emit('set-class-element-selected', 'text-head');
      emit('set-key-element-selected', 'textProduct');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForText);
      });
    }
    if (event.target?.classList.contains('text-des')) {
      emit('set-class-element-selected', 'text-des');
      emit('set-key-element-selected', 'textDes');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForText);
      });
    }
    if (event.target?.closest('.right-section-image:not(.reverse)')) {
      emit('set-class-element-selected', 'box-image');
      emit('set-key-element-selected', 'boxImage');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForRightImage);
      });
    }
    if (event.target?.closest('.right-section-image.reverse')) {
      emit('set-class-element-selected', 'box-image');
      emit('set-key-element-selected', 'boxImage');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForLeftImage);
      });
    }
    if (event.target?.closest('.card-audio')) {
      const indexAudio = event.target?.closest('.card-audio')?.dataset.index;
      emit('set-index-audio', Number(indexAudio));
      if (event.target?.classList.contains('audio-image')) {
        emit('set-class-element-selected', 'audio-image');
        emit('set-key-element-selected', 'audio');
        nextTick(() => {
          handleSetPosition(event.target, getPositionForAudioImage);
        });
      }
      if (event.target?.classList.contains('audio-text-subtitle')) {
        emit('set-class-element-selected', 'audio-text-subtitle');
        emit('set-key-element-selected', 'textSubtitle');
        nextTick(() => {
          handleSetPosition(event.target, getPositionForText);
        });
      }
      if (event.target?.classList.contains('audio-text-product')) {
        emit('set-class-element-selected', 'audio-text-subtitle');
        emit('set-key-element-selected', 'textProduction');
        nextTick(() => {
          handleSetPosition(event.target, getPositionForText);
        });
      }
    } else {
      emit('set-index-audio', undefined);
    }
  }
};

// const handleRemoveLabel = () => {
//   isShowLabelElement.value = false;
// };

const initHover = () => {
  const editor = document.getElementById('editor');
  let defaultBorder = '';

  const handleHover = (e: MouseEvent) => {
    if (props.templateSelected?.id) return;
    if (isDisabledEditor.value) return;
    const target = e.target as HTMLElement;
    const listItemNotHover = ['.icon-play', '.icon-sound'];
    if (listItemNotHover.some((item) => Boolean(target.closest(item)))) {
      return;
    }

    if (props.templateSelected.value) return;

    defaultBorder = target.style.border;

    if (
      editor &&
      target !== editor &&
      editor.contains(target) &&
      target !== elementSelected.value
    ) {
      target.style.border = '2px solid #1EDD00';
    }
  };

  const handleOut = (e: MouseEvent) => {
    if (isDisabledEditor.value) return;
    const target = e.target as HTMLElement;
    target.style.border = defaultBorder;
  };

  editor?.addEventListener('mouseover', handleHover);
  editor?.addEventListener('mouseout', handleOut);
};

defineExpose({
  calcPositionLabel,
});
onMounted(initHover);
</script>

<style lang="scss" scoped>
.input-enter-button {
  outline: none;
  background-color: transparent;
  border: none;
  color: #fff;
}
#editor {
  flex: 1;
  background-color: #fff;
  overflow-y: auto;
  color: white;
  .section {
    position: relative;

    &.hover-top {
      border-top: 2px solid rgba(255, 44, 240, 1);
    }

    &.hover-bottom {
      border-bottom: 2px solid rgba(255, 44, 240, 1);
    }

    .zone-label {
      position: absolute;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 500;
      color: white;
      background-color: rgba(255, 44, 240, 1);
      border-radius: 999px;
      z-index: 21;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;

      &.top {
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
      }

      &.bottom {
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
      }

      &.left {
        top: -22px;
        right: -2px;
        height: fit-content;
        width: fit-content;
        border-radius: 0;
      }
    }

    .hover-zone {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 20;

      &.top {
        top: 0;
        height: 50%;
        border-left: 2px dashed #2589ff;
        border-right: 2px dashed #2589ff;
        border-bottom: 2px dashed #2589ff;
        background: rgba(37, 137, 255, 0.3);
      }

      &.bottom {
        bottom: 0;
        height: 50%;
        border-left: 2px dashed #2589ff;
        border-right: 2px dashed #2589ff;
        border-top: 2px dashed #2589ff;
        background: rgba(37, 137, 255, 0.3);
      }
    }
  }
  .label-element-selecting {
    position: fixed;
    z-index: 30;
    pointer-events: none;
    &.button-href {
      border: 2px solid #1edd00;
    }
    .border-audio {
      width: 100%;
      margin-top: -20px;
      height: calc(100% + 20px);
      background-image: url(@/assets/images/border-audio.svg);
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      .text-label-audio {
        background-color: $brand-green-200-main;
        padding: 1px 6px;
        position: absolute;
        top: 0;
        transform: translateY(-100%);
      }
      .audio-box {
        position: absolute;
        top: 0;
        left: 40px;
        padding: 1px 6px;
        transform: translateY(-100%);
        display: flex;
        align-items: center;
        gap: 4px;
        background: linear-gradient(66deg, #0078d8 15.31%, #ff2cf0 84.69%);
      }
    }
    .text-label {
      display: flex;
      gap: 4px;
      align-items: center;
      background-color: $brand-green-200-main;
      padding: 1px 6px;
      position: absolute;
      transform: translate(-2px, -100%);
    }
  }
  :deep(.selected) {
    outline: 2px solid rgba(30, 221, 0, 1);
  }
}
</style>
