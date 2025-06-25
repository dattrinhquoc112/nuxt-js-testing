<template>
  <div id="editor">
    <div
      v-for="(section, index) in sections"
      :key="index"
      ref="listSectionRef"
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

    <editor-label-element
      ref="labelElementSelectingHover"
      :is-show="isShowLabelHoverElement"
      :type-label="typeLabelHover"
    />
    <editor-label-element
      ref="labelElementSelecting"
      :is-show="isShowLabelElement"
      :type-label="typeLabel"
    />
    <editor-label-element :is-show="isShowLabelElement" />
  </div>
</template>

<script lang="ts" setup>
import useCheckPermission from '~/composables/checkPermission';
import { RWD_MODE } from '~/constants/common';
import type { ILabelElement } from '~/types/common';
import type { AUDIO_ITEM, SECTION_ITEM } from '~/types/templates';

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
  'show-popup-setting-audio',
]);

const isShowLabelElement = ref<boolean>(false);
const isShowLabelHoverElement = ref<boolean>(false);
const elementHover = ref<HTMLElement>();
const elementSelected = ref<HTMLElement>();
const labelElementSelecting = ref<any>();
const labelElementSelectingHover = ref<any>();
const listSectionRef = ref<HTMLElement[]>();

const initStatusLabel: ILabelElement = {
  isButtonHref: false,
  isBorderAudio: false,
  borderSection: false,
  isLogo: false,
  isElementRest: false,
  isImageRightSection: false,
};
const typeLabel = ref<ILabelElement>({
  ...initStatusLabel,
});
const typeLabelHover = ref<ILabelElement>({
  ...initStatusLabel,
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

const handleRemoveAllLabel = () => {
  isShowLabelElement.value = false;
  isShowLabelHoverElement.value = false;
  elementSelected.value = undefined;
};

const hiddenBoxControl = () => {
  emit('set-show-control', false);
  emit('hidden-all-popup-setting');
  handleRemoveAllLabel();
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
  const pageY = coordinates.bottom - 30;
  const pageX = coordinates.left + coordinates.width / 2;
  return { pageY, pageX };
};

const getPositionForLeftImage = (coordinates: any) => {
  const pageY = coordinates.bottom - 30;
  const pageX = coordinates.left + coordinates.width / 2;
  return { pageY, pageX };
};

const calcPosition = (
  target: HTMLElement | null = null,
  isHover: boolean = false
) => {
  const labelElement = isHover
    ? labelElementSelectingHover.value
    : labelElementSelecting.value;
  if (!labelElement) return;

  let coordinates: DOMRect | undefined;
  if (target) {
    coordinates = target.getBoundingClientRect();
  } else if (isHover ? elementHover.value : elementSelected.value) {
    coordinates = (
      isHover ? elementHover.value : elementSelected.value
    )?.getBoundingClientRect();
  } else {
    return;
  }

  if (labelElement && coordinates) {
    labelElement.setPosition(coordinates);
  }
};

const handleShowLabel = (
  target: HTMLElement | null,
  isHover: boolean = false
) => {
  const label = isHover ? typeLabelHover : typeLabel;
  const isShowLabel = isHover ? isShowLabelHoverElement : isShowLabelElement;

  label.value = { ...initStatusLabel };
  isShowLabel.value = false;
  let targetReplace: any = target;

  if (
    !target ||
    (isHover && elementHover.value === target) ||
    (!isHover && elementSelected.value === target)
  )
    return;

  isShowLabel.value = true;
  if (isHover) {
    elementHover.value = targetReplace;
  }

  const classAudio = isHover ? 'image-background' : 'audio-background';

  if (targetReplace.classList.contains('button-href')) {
    label.value.isButtonHref = true;
  } else if (targetReplace.classList.contains('section-logo-image')) {
    label.value.isLogo = true;
  } else if (
    targetReplace.classList.contains('text-title') ||
    targetReplace.classList.contains('text-head') ||
    targetReplace.classList.contains('audio-text-subtitle') ||
    targetReplace.classList.contains('audio-text-product') ||
    targetReplace.classList.contains('text-des')
  ) {
    label.value.isElementRest = true;
  } else if (
    targetReplace.classList.contains('tag-right-section-image') ||
    targetReplace.classList.contains('box-section-two')
  ) {
    label.value.isImageRightSection = true;
  } else if (targetReplace.classList.contains(classAudio)) {
    label.value.isBorderAudio = true;
  } else {
    label.value.borderSection = true;
    targetReplace = targetReplace.closest('.section-wrap');
    elementHover.value = targetReplace;
  }

  calcPosition(targetReplace, isHover);
};

const handleSetLabel = (target: HTMLElement) => {
  handleShowLabel(target, false);
};

const handleShowLabelHover = (target: HTMLElement) => {
  handleShowLabel(target, true);
};

const handleShowOption = (event: any, index: number) => {
  if (isDisabledEditor.value) return;
  if (event.target?.closest('.section-wrap')) {
    handleSetLabel(event.target);
    emit('set-index-section-selected', index);
    elementSelected.value = event.target;
    emit('set-selected-element', event.target);
    if (event.target?.closest('.right-section-image:not(.reverse)')) {
      emit('set-class-element-selected', 'box-image-right');
      emit('set-key-element-selected', 'boxImage');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForRightImage);
      });
    } else if (event.target?.closest('.right-section-image.reverse')) {
      emit('set-class-element-selected', 'box-image-left');
      emit('set-key-element-selected', 'boxImage');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForLeftImage);
      });
    } else if (event.target?.closest('.card-audio')) {
      const indexAudio = event.target?.closest('.card-audio')?.dataset.index;
      emit('set-index-audio', Number(indexAudio));
      if (event.target?.classList.contains('audio-background')) {
        emit('set-class-element-selected', 'audio-background');
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
    } else if (event.target?.classList.contains('section-wrap')) {
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
    } else if (event.target?.classList.contains('section-logo-image')) {
      emit('set-class-element-selected', 'section-logo-image');
      emit('set-key-element-selected', 'logo');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForImageLogo);
      });
    } else if (event.target?.classList.contains('button-href')) {
      emit('set-class-element-selected', 'button-href');
      emit('set-key-element-selected', 'buttonExternal');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForButtonHref);
      });
    } else if (event.target?.classList.contains('text-title')) {
      emit('set-class-element-selected', 'text-title');
      emit('set-key-element-selected', 'textTitle');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForText);
      });
    } else if (event.target?.classList.contains('text-head')) {
      emit('set-class-element-selected', 'text-head');
      emit('set-key-element-selected', 'textProduct');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForText);
      });
    } else if (event.target?.classList.contains('text-des')) {
      emit('set-class-element-selected', 'text-des');
      emit('set-key-element-selected', 'textDes');
      nextTick(() => {
        handleSetPosition(event.target, getPositionForText);
      });
    } else {
      const eventTargetReplace = event.target.closest('.section-wrap');
      emit('set-index-audio', undefined);
      emit('set-class-element-selected', 'section-wrap');
      emit('set-key-element-selected', 'backgroundSection');
      handleSetLabel(eventTargetReplace);
      elementSelected.value = eventTargetReplace;
      emit('set-selected-element', eventTargetReplace);

      nextTick(() => {
        handleSetPosition(
          event.target.closest('.section-wrap'),
          getPositionForSection
        );
      });
    }
  }
};

const scrollToSetupAudio = () => {
  props.sections.forEach((sectionItem: SECTION_ITEM, indexSection: number) => {
    if (sectionItem.id === 'audio-section') {
      sectionItem.listAudio?.forEach((item: AUDIO_ITEM, audioIndex: number) => {
        if (
          !item.audio.setting.voiceModelId?.value ||
          !item.audio.setting.listPhrase?.length ||
          !item.audio.setting.listPhrase.every((itemVoice) => itemVoice.id)
        ) {
          const sectionElement = listSectionRef.value?.[indexSection];
          const itemAudioElement = sectionElement
            ?.querySelectorAll('.card-audio')
            ?.[audioIndex]?.querySelector('.audio-background');

          sectionElement?.scrollIntoView({
            block: 'end',
            inline: 'nearest',
          });

          setTimeout(() => {
            if (itemAudioElement) {
              (itemAudioElement as HTMLElement).click();
              setTimeout(() => {
                emit('show-popup-setting-audio');
              });
            }
          });
        }
      });
    }
  });
};

const initHover = () => {
  const editor = document.getElementById('editor');

  const handleHover = (e: MouseEvent) => {
    if (props.templateSelected?.id) return;
    if (isDisabledEditor.value) return;
    const target = e.target as HTMLElement;

    const listItemNotHover = ['.icon-play', '.icon-sound'];
    if (listItemNotHover.some((item) => Boolean(target.closest(item)))) {
      return;
    }

    if (props.templateSelected.value) return;

    if (editor && target !== editor && editor.contains(target)) {
      handleShowLabelHover(target);
    }
  };

  const handleOut = () => {
    isShowLabelHoverElement.value = false;
  };

  editor?.addEventListener('mouseover', handleHover);
  editor?.addEventListener('mouseout', handleOut);
};

defineExpose({
  calcPosition,
  scrollToSetupAudio,
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

  :deep(.selected) {
    outline: 2px solid rgba(30, 221, 0, 1);
  }
}
</style>
