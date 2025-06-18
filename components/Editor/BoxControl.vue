<template>
  <div
    id="boxControlElement"
    class="box-control"
    :style="{
      visibility: isShowControl ? 'visible' : 'hidden',
      left: positionControlCurrent?.pageX
        ? `${positionControlCurrent?.pageX}px`
        : '',
      top: positionControlCurrent?.pageY
        ? `${positionControlCurrent?.pageY}px`
        : '',
    }"
  >
    <div
      v-for="itemControl in listOptionControl"
      :key="itemControl.icon"
      class="item"
      :class="[
        itemControl?.classStyle ? itemControl?.classStyle : '',
        { disabled: itemControl.disabled },
      ]"
      @click="emit('action-event', itemControl?.fn)"
    >
      <vi-icon
        :name="itemControl.icon"
        :size="itemControl?.size ?? 24"
        :color="itemControl?.color ?? '#fff'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['action-event']);
const props = defineProps({
  positionControlCurrent: {
    type: Object,
    default: () => ({}),
  },
  isShowControl: {
    type: Boolean,
    default: false,
  },
  indexSectionSelected: {
    type: Number,
    default: undefined,
  },
  sections: {
    type: Array,
    default: () => [],
  },
  classElementSelected: {
    type: String,
    default: '',
  },
});

const isDisabledMoveUp = computed(
  () =>
    props.indexSectionSelected === undefined || props.indexSectionSelected === 1
);
const isDisabledMoveDown = computed(
  () =>
    props.indexSectionSelected === undefined ||
    props.indexSectionSelected === props.sections.length - 2
);
const listOptionControl = computed<
  {
    icon: string;
    fn: string;
    classStyle?: string;
    color?: string;
    disabled?: boolean;
    size?: number;
  }[]
>(() => {
  if (
    props.classElementSelected === 'audio-text-subtitle' ||
    props.classElementSelected === 'audio-text-product' ||
    props.classElementSelected === 'text-title' ||
    props.classElementSelected === 'text-des' ||
    props.classElementSelected === 'text-head'
  ) {
    return [
      {
        icon: 'ic_color',
        fn: 'showPopupSettingColor',
      },
      {
        icon: 'ic_text',
        fn: 'showPopupSettingText',
      },
    ];
  }
  if (props.classElementSelected === 'button-href') {
    return [
      {
        icon: 'ic_color',
        fn: 'showPopupSettingColor',
      },
      {
        icon: 'ic_text',
        fn: 'showPopupSettingText',
      },
      {
        icon: 'ic_link',
        fn: 'showPopupSettingLink',
      },
    ];
  }
  if (props.classElementSelected === 'audio-image') {
    return [
      {
        icon: 'ic_picture',
        fn: 'showPopupChangeImage',
      },
      {
        icon: 'ic_ai_option',
        fn: 'showPopupSettingAudio',
      },
    ];
  }
  if (props.classElementSelected === 'section-logo') {
    return [
      {
        icon: 'ic_color',
        fn: 'showPopupSettingColor',
      },
    ];
  }
  if (
    props.classElementSelected === 'section-logo-image' ||
    props.classElementSelected === 'box-image'
  ) {
    return [
      {
        icon: 'ic_picture',
        fn: 'showPopupChangeImage',
      },
    ];
  }
  if (props.classElementSelected === 'section-copyright') {
    return [
      {
        icon: 'ic_color',
        fn: 'showPopupSettingColor',
      },
    ];
  }
  return [
    {
      icon: 'ic_arrow_up',
      fn: 'moveUp',
      disabled: isDisabledMoveUp.value,
    },
    {
      icon: 'ic_arrow_down',
      fn: 'moveDown',
      disabled: isDisabledMoveDown.value,
    },
    {
      icon: 'ic_color',
      fn: 'showPopupSettingColor',
    },
    {
      icon: 'ic_picture',
      fn: 'showPopupChangeImage',
    },
    {
      icon: 'ic_delete',
      color: '#D93A50',
      fn: 'handleDeleteSection',
    },
  ];
});
</script>

<style lang="scss" scoped>
.box-control {
  position: fixed;
  border-radius: 28px;
  background: $brand-navy-900-main;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  z-index: 15;

  &.for-section-wrap {
    width: 56px;
    flex-direction: column;
    padding: 16px 0;
    .item + .item {
      margin-top: 12px;
    }
  }
  &.for-button-href,
  &.for-text-des,
  &.for-text-title,
  &.for-audio-text-subtitle,
  &.for-audio-text-product,
  &.for-section-copyright,
  &.for-section-logo,
  &.for-section-logo-image,
  &.for-audio-image,
  &.for-text-head {
    transform: translateX(-50%);
    &.show-on-top {
      transform: translateX(-50%) translateY(-100%);
    }
  }
  .item {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      border: 1px solid rgba($color: #fff, $alpha: 0.12);
      background-color: rgba($color: #2589ff, $alpha: 0.3);
    }
    &.box-ai-icon {
      background: linear-gradient(66deg, #0078d8 15.31%, #ff2cf0 84.69%);
      &:hover {
        background-color: unset;
      }
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}
</style>
