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
        @click="emit('add-section', index)"
        :class="hoverPosition.zone"
      ></div>

      <editor-section-render
        :section="section"
        @show-option="(event) => handleShowOption(event, index)"
        @handle-change-text="(event) => emit('handle-change-text', event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
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
});
const emit = defineEmits([
  'add-section',
  'set-position-control',
  'set-show-control',
  'hidden-all-popup-setting',
  'set-class-element-selected',
  'set-key-element-selected',
  'set-index-section-selected',
  'show-popup-change-image',
  'set-selected-element',
  'handle-change-text',
  'set-hover-position',
  'set-index-audio',
]);

const hoverPosition = ref<{ index: number; zone: 'top' | 'bottom' } | null>(
  null
);
const boxControlElement = computed(() =>
  document.getElementById('boxControlElement')
);

const onHoverSection = (e: MouseEvent, index: number) => {
  if (!props.templateSelected) return;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const halfway = rect.top + rect.height / 2;
  const zone = e.clientY < halfway ? 'top' : 'bottom';
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

const showOptionForButtonHref = (elementButton: HTMLElement) => {
  if (!boxControlElement.value) return;

  emit('hidden-all-popup-setting');

  boxControlElement.value.setAttribute('class', 'box-control');
  boxControlElement.value.classList.add(`for-${props.classElementSelected}`);

  const coordinates = elementButton.getBoundingClientRect();
  const pageY = coordinates.bottom + 12;
  const pageX = coordinates.left + coordinates.width / 2;
  emit('set-show-control', true);

  emit('set-position-control', {
    pageY,
    pageX,
  });

  window.addEventListener('click', hiddenBoxControlWhenClick);
};
const showOptionForSection = (elementSection: HTMLElement) => {
  if (!boxControlElement.value) return;
  emit('hidden-all-popup-setting');

  boxControlElement.value.setAttribute('class', 'box-control');
  boxControlElement.value.classList.add(`for-${props.classElementSelected}`);

  const coordinates = elementSection.getBoundingClientRect();
  const heightBoxControl = boxControlElement.value.clientHeight
    ? boxControlElement.value.clientHeight / 2
    : 0;
  const pageY = coordinates.height / 2 - heightBoxControl + coordinates.top;
  const pageX = coordinates.width - 60 + coordinates.left;
  emit('set-show-control', true);

  emit('set-position-control', {
    pageY,
    pageX,
  });

  window.addEventListener('click', hiddenBoxControlWhenClick);
};

const showOptionForAudioImage = (elementSelected: HTMLElement) => {
  if (!boxControlElement.value) return;
  emit('hidden-all-popup-setting');

  boxControlElement.value.setAttribute('class', 'box-control');
  boxControlElement.value.classList.add(`for-${props.classElementSelected}`);

  const coordinates = elementSelected.getBoundingClientRect();
  const pageY = coordinates.bottom + 12;
  const pageX = coordinates.left + coordinates.width / 2;
  emit('set-show-control', true);

  emit('set-position-control', {
    pageY,
    pageX,
  });

  window.addEventListener('click', hiddenBoxControlWhenClick);
};

const showOptionForText = (elementButton: HTMLElement) => {
  if (!boxControlElement.value) return;
  emit('hidden-all-popup-setting');

  boxControlElement.value.setAttribute('class', 'box-control');
  boxControlElement.value.classList.add(`for-${props.classElementSelected}`);

  const coordinates = elementButton.getBoundingClientRect();
  const pageY = coordinates.bottom + 12;
  const pageX = coordinates.left + coordinates.width / 2;
  emit('set-show-control', true);

  emit('set-position-control', {
    pageY,
    pageX,
  });

  window.addEventListener('click', hiddenBoxControlWhenClick);
};

const showOptionForRightImage = (elementButton: HTMLElement) => {
  hiddenBoxControl();

  const coordinates = elementButton.getBoundingClientRect();
  const pageY = coordinates.bottom - coordinates.height / 2;
  const pageX = coordinates.left;

  emit('set-position-control', {
    pageY,
    pageX,
  });

  emit('show-popup-change-image');
  window.addEventListener('click', hiddenBoxControlWhenClick);
};

const handleShowOption = (event: any, index: number) => {
  if (event.target?.closest('.section-wrap')) {
    emit('set-index-section-selected', index);
    if (event.target?.classList.contains('section-wrap')) {
      emit('set-class-element-selected', 'section-wrap');
      emit('set-key-element-selected', 'backgroundSection');
      nextTick(() => {
        emit('set-selected-element', event.target);
        showOptionForSection(event.target);
      });
    }
    if (event.target?.classList.contains('button-href')) {
      emit('set-class-element-selected', 'button-href');
      emit('set-key-element-selected', 'buttonExternal');
      nextTick(() => {
        emit('set-selected-element', event.target);
        showOptionForButtonHref(event.target);
      });
    }
    if (event.target?.classList.contains('text-title')) {
      emit('set-class-element-selected', 'text-title');
      emit('set-key-element-selected', 'textTitle');
      nextTick(() => {
        emit('set-selected-element', event.target);
        showOptionForText(event.target);
      });
    }
    if (event.target?.classList.contains('text-head')) {
      emit('set-class-element-selected', 'text-head');
      emit('set-key-element-selected', 'textProduct');
      nextTick(() => {
        emit('set-selected-element', event.target);
        showOptionForText(event.target);
      });
    }
    if (event.target?.classList.contains('text-des')) {
      emit('set-class-element-selected', 'text-des');
      emit('set-key-element-selected', 'textDes');
      nextTick(() => {
        emit('set-selected-element', event.target);
        showOptionForText(event.target);
      });
    }
    if (event.target?.classList.contains('right-section-image')) {
      emit('set-key-element-selected', 'boxImage');
      nextTick(() => {
        emit('set-selected-element', event.target);
        showOptionForRightImage(event.target);
      });
    }
    if (event.target?.closest('.card-audio')) {
      const indexAudio = event.target?.closest('.card-audio')?.dataset.index;
      emit('set-index-audio', Number(indexAudio));
      if (event.target?.classList.contains('audio-image')) {
        emit('set-class-element-selected', 'audio-image');
        emit('set-key-element-selected', 'audio');
        nextTick(() => {
          emit('set-selected-element', event.target);
          showOptionForAudioImage(event.target);
        });
      }
      if (event.target?.classList.contains('audio-text-subtitle')) {
        emit('set-class-element-selected', 'audio-text-subtitle');
        emit('set-key-element-selected', 'textSubtitle');
        nextTick(() => {
          emit('set-selected-element', event.target);
          showOptionForText(event.target);
        });
      }
      if (event.target?.classList.contains('audio-text-product')) {
        emit('set-class-element-selected', 'audio-text-subtitle');
        emit('set-key-element-selected', 'textProduction');
        nextTick(() => {
          emit('set-selected-element', event.target);
          showOptionForText(event.target);
        });
      }
    } else {
      emit('set-index-audio', undefined);
    }
  }
};

const initHover = () => {
  const editor = document.getElementById('editor');
  let defaultOutline = '';

  const handleHover = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.icon-play')) {
      return;
    }

    if (props.templateSelected.value) return;

    defaultOutline = target.style.outline;

    if (editor && target !== editor && editor.contains(target)) {
      target.style.outline = '2px dashed rgba(37, 137, 255, 1)';
    }
  };

  const handleOut = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    target.style.outline = defaultOutline;
  };

  editor?.addEventListener('mouseover', handleHover);
  editor?.addEventListener('mouseout', handleOut);
};
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
  background-color: #1e1e1e;
  padding: 20px;
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
      z-index: 20;
      white-space: nowrap;

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
