<template>
  <div class="container">
    {{ currentIndex }}
    {{ history.length }}
    <editor-template-selector
      v-if="isShowListSection"
      :templateSelected="templateSelected"
      @click-template="onClickTemplate"
      @close="emit('closeSection')"
    />

    <editor-list
      :templateSelected="templateSelected"
      :classElementSelected="classElementSelected"
      :sections="sections"
      @add-section="(index) => onClickAddSection(index)"
      @set-position-control="handleSetPositionControl"
      @set-show-control="(value) => (isShowControl = value)"
      @hidden-all-popup-setting="hiddenAllPopupSetting"
      @set-class-element-selected="(val) => (classElementSelected = val)"
      @set-key-element-selected="(val) => (keyElementSelected = val)"
      @set-index-section-selected="(val) => (indexSectionSelected = val)"
      @show-popup-change-image="showPopupChangeImage"
      @set-selected-element="(val) => (selectedElement = val)"
      @handle-change-text="handleChangeText"
      @set-hover-position="(val) => (hoverPosition = val)"
    />

    <editor-box-control
      :positionControlCurrent="positionControlCurrent"
      :isShowControl="isShowControl"
      :classElementSelected="classElementSelected"
      @action-event="(key) => (defineAction[key as keyof typeof defineAction])()"
    />

    <editor-setting-image
      :class="classPopupSettingImage"
      :isShow="isShowPopup.imageSetting"
      :positionControlCurrent="positionControlCurrent"
      @close="closePopupChangeImage"
      @change-image="handleChangeImage"
      @change-video="handleChangeVideo"
    />
    <editor-setting-link
      :isShow="isShowPopup.addLink"
      :positionControlCurrent="positionControlCurrent"
      @close="closePopupSettingLink"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
      @change-link="handleChangeLink"
    />

    <editor-setting-text
      :isShow="isShowPopup.textSetting"
      :positionControlCurrent="positionControlCurrent"
      @close="closePopupSettingText"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
      @change-align="handleChangeAlign"
      @change-size="handleChangeSize"
    />
    <editor-setting-color
      :class="
        keyElementSelected === 'backgroundSection' ? 'for-bg-section' : ''
      "
      :isShow="isShowPopup.colorSetting"
      :positionControlCurrent="positionControlCurrent"
      @close="closePopupSettingColor"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
      @change-color="(rgba:RGBA) => (buttonColor = rgba)"
    />
  </div>
</template>

<script lang="ts" setup>
import { TEMPLATES_OBJ } from '@/types/templates';
import { type RGBA } from '@/types/color';
import { DEBOUND_TIME_SAVE_HISTORY } from '@/constants/common';

let debounceTimer: any = null;
const MAX_HISTORY = 20;
const iSaveHistory = ref(false);
definePageMeta({
  layout: 'default',
});
defineProps({
  isShowListSection: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['closeSection']);

const templateSelected = ref();
const buttonColor = ref<RGBA>({
  r: 255,
  g: 255,
  b: 255,
  a: 1,
});
const indexSectionSelected = ref<number>();
const classElementSelected = ref<string>();
const keyElementSelected = ref<string>();
const positionControlCurrent = ref<{ pageX: number; pageY: number }>({
  pageX: 0,
  pageY: 0,
});
//
const sections = ref<any[]>([]);
const history = ref<any[]>(JSON.parse(JSON.stringify([[TEMPLATES_OBJ[0]]])));
const currentIndex = ref<number>(0);

const hoverPosition = ref<{ index: number; zone: 'top' | 'bottom' } | null>(
  null
);
const boxControlElement = computed(() =>
  document.getElementById('boxControlElement')
);
const selectedElement = ref<HTMLElement>();
const isShowControl = ref(false);
const initPopupSetting = {
  imageSetting: false,
  addLink: false,
  textSetting: false,
  colorSetting: false,
};
const isShowPopup = ref({
  ...initPopupSetting,
});

const objectSelecting = computed(() => {
  if (!keyElementSelected.value) return undefined;
  if (indexSectionSelected.value === undefined) return undefined;
  return sections.value[indexSectionSelected.value][keyElementSelected.value];
});

const handleSetPositionControl = (data: { pageX: number; pageY: number }) => {
  positionControlCurrent.value = data;
};

const classPopupSettingImage = computed(() => {
  if (keyElementSelected.value === 'backgroundSection') return 'for-bg-section';
  if (keyElementSelected.value === 'boxImage') return 'for-box-image';
  return '';
});
watch(buttonColor, () => {
  const colorChange = `rgba(${buttonColor.value.r},${buttonColor.value.g},${
    buttonColor.value.b
  },${buttonColor.value.a / 100})`;
  if (keyElementSelected.value === 'buttonExternal') {
    objectSelecting.value.style.backgroundColor = colorChange;
    const oppositeColor = getOppositeColor(buttonColor.value);
    objectSelecting.value.style.color = `rgba(${oppositeColor.r},${
      oppositeColor.g
    },${oppositeColor.b},${oppositeColor.a / 100})`;
  } else if (keyElementSelected.value !== 'backgroundSection') {
    objectSelecting.value.style.color = colorChange;
  } else {
    objectSelecting.value.class = 'bg-color';
    objectSelecting.value.color = colorChange;
    objectSelecting.value.urlImg = '';
    if (objectSelecting.value.urlVideo) {
      URL.revokeObjectURL(objectSelecting.value.urlVideo);
      objectSelecting.value.urlVideo = '';
    }
    if (objectSelecting.value.urlImg) {
      URL.revokeObjectURL(objectSelecting.value.urlImg);
      objectSelecting.value.urlImg = '';
    }
  }
});

const handleChangeVideo = (urlVideo: string) => {
  if (keyElementSelected.value === 'boxImage') {
    if (objectSelecting.value.imgUrl) {
      URL.revokeObjectURL(objectSelecting.value.imgUrl);
    }
    if (objectSelecting.value.imgVideo) {
      URL.revokeObjectURL(objectSelecting.value.imgVideo);
    }
    objectSelecting.value.imgUrl = '';
    objectSelecting.value.imgVideo = urlVideo;
  } else {
    objectSelecting.value.class = '';
    objectSelecting.value.color = '';
    if (objectSelecting.value.urlVideo) {
      URL.revokeObjectURL(objectSelecting.value.urlVideo);
    }
    if (objectSelecting.value.urlImg) {
      URL.revokeObjectURL(objectSelecting.value.urlImg);
      objectSelecting.value.urlImg = '';
    }
    objectSelecting.value.urlVideo = urlVideo;
  }
};
const handleChangeText = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  const { width } = element.getBoundingClientRect();
  const textarea = document.createElement('textarea');
  textarea.style.width = `${width}px`;
  textarea.classList.add('input-enter-button');
  textarea.value = element.textContent as string;
  element.textContent = '';
  element.appendChild(textarea);
  textarea.focus();
  textarea.addEventListener('blur', () => {
    objectSelecting.value.text = textarea.value;
    element.textContent = textarea.value;
  });
};
const handleChangeImage = (urlImg: string) => {
  if (keyElementSelected.value === 'boxImage') {
    if (objectSelecting.value.imgUrl) {
      URL.revokeObjectURL(objectSelecting.value.imgUrl);
    }
    if (objectSelecting.value.imgVideo) {
      URL.revokeObjectURL(objectSelecting.value.imgVideo);
    }
    objectSelecting.value.imgUrl = urlImg;
    objectSelecting.value.imgVideo = '';
  } else {
    objectSelecting.value.class = 'bg-img';
    objectSelecting.value.color = '';
    if (objectSelecting.value.urlImg) {
      URL.revokeObjectURL(objectSelecting.value.urlImg);
    }
    if (objectSelecting.value.urlVideo) {
      URL.revokeObjectURL(objectSelecting.value.urlVideo);
      objectSelecting.value.urlVideo = '';
    }
    objectSelecting.value.urlImg = urlImg;
  }
};
const handleChangeAlign = (align: string) => {
  objectSelecting.value.style.textAlign = align;
};

const handleChangeSize = (size: string) => {
  objectSelecting.value.style.fontSize = size;
};

const handleChangeLink = (link: string) => {
  objectSelecting.value.link = link;
};

const handleMoveTopPopup = () => {
  if (!selectedElement.value) return;
  if (keyElementSelected.value !== 'backgroundSection') {
    const coordinates = selectedElement.value.getBoundingClientRect();
    const pageY = coordinates.top - 12;
    const pageX = coordinates.left + coordinates.width / 2;
    positionControlCurrent.value = {
      pageY,
      pageX,
    };
  }
  boxControlElement.value?.classList.remove('show-on-bottom');
  boxControlElement.value?.classList.add('show-on-top');
};
const handleMoveBottomPopup = () => {
  if (!selectedElement.value) return;
  if (keyElementSelected.value !== 'backgroundSection') {
    const coordinates = selectedElement.value.getBoundingClientRect();
    const pageY = coordinates.bottom + 12;
    const pageX = coordinates.left + coordinates.width / 2;
    positionControlCurrent.value = {
      pageY,
      pageX,
    };
  }
  boxControlElement.value?.classList.remove('show-on-top');
  boxControlElement.value?.classList.add('show-on-bottom');
};

const hiddenAllPopupSetting = () => {
  isShowPopup.value = { ...initPopupSetting };
};

const hiddenBoxControl = () => {
  isShowControl.value = false;
  hiddenAllPopupSetting();
  window.removeEventListener('scroll', hiddenBoxControl);
};

const moveDown = () => {
  if (indexSectionSelected.value === undefined) return;
  if (sections.value.length < 2) return;
  if (indexSectionSelected.value < sections.value.length - 1) {
    const templateDraft = sections.value[indexSectionSelected.value];
    sections.value[indexSectionSelected.value] =
      sections.value[indexSectionSelected.value + 1];
    sections.value[indexSectionSelected.value + 1] = templateDraft;
  }
};

const moveUp = () => {
  if (indexSectionSelected.value === undefined) return;
  if (sections.value.length < 2) return;
  if (indexSectionSelected.value !== 0) {
    const templateDraft = sections.value[indexSectionSelected.value];
    sections.value[indexSectionSelected.value] =
      sections.value[indexSectionSelected.value - 1];
    sections.value[indexSectionSelected.value - 1] = templateDraft;
  }
};

const removeTemplateWhenClick = (event: MouseEvent) => {
  if (
    !(event.target as HTMLElement).closest('.template') &&
    !(event.target as HTMLElement).closest('.hover-zone') &&
    !(event.target as HTMLElement).closest('.zone-label')
  ) {
    templateSelected.value = undefined;
    window.removeEventListener('click', removeTemplateWhenClick);
  }
};
watch(objectSelecting, () => {
  iSaveHistory.value = true;
});
watch(
  sections,
  (newVal) => {
    if (iSaveHistory.value) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (currentIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, currentIndex.value + 1);
      }

      // Thêm bản ghi mới
      history.value.push(JSON.parse(JSON.stringify(newVal))); // deep copy

      debounceTimer = setTimeout(() => {
        history.value.push(JSON.parse(JSON.stringify(newVal)));
        currentIndex.value++;
        if (history.value.length > MAX_HISTORY) {
          history.value.shift();
          history.value = history.value.slice(0, currentIndex.value + 1);

          currentIndex.value--;
        }
      }, DEBOUND_TIME_SAVE_HISTORY);
    }
  },
  { deep: true }
);

// Undo
const undo = () => {
  if (currentIndex.value > 0) {
    iSaveHistory.value = false;
    currentIndex.value -= 1;
    sections.value = JSON.parse(
      JSON.stringify(history.value[currentIndex.value])
    );
  }
};

// Redo
const redo = () => {
  if (currentIndex.value < history.value.length) {
    iSaveHistory.value = false;
    currentIndex.value++;
    sections.value = JSON.parse(
      JSON.stringify(history.value[currentIndex.value])
    );
  }
};
const onClickTemplate = (template: any) => {
  if (templateSelected.value?.id === template?.id) {
    templateSelected.value = undefined;
    return;
  }
  templateSelected.value = template;
  if (sections.value.length === 0) {
    sections.value = [templateSelected.value];
  }
  window.addEventListener('click', removeTemplateWhenClick);
};
watch(
  history,
  (newVasl) => {
    console.log(newVasl[0], 'newVasl');
  },
  { deep: true }
);
const onClickAddSection = (index: number) => {
  if (templateSelected.value) {
    const newIndex = hoverPosition.value?.zone === 'bottom' ? index + 1 : index;
    sections.value.splice(
      newIndex,
      0,
      JSON.parse(JSON.stringify(templateSelected.value))
    );
    templateSelected.value = undefined;
  }
};
const showPopupSettingText = () => {
  isShowPopup.value.textSetting = true;
};
const showPopupSettingLink = () => {
  isShowPopup.value.addLink = true;
};
const showPopupSettingColor = () => {
  isShowPopup.value.colorSetting = true;
};
const showPopupChangeImage = () => {
  isShowPopup.value.imageSetting = true;
};
const closePopupChangeImage = () => {
  isShowPopup.value.imageSetting = false;
};
const closePopupSettingLink = () => {
  isShowPopup.value.addLink = false;
};
const closePopupSettingColor = () => {
  isShowPopup.value.colorSetting = false;
};
const closePopupSettingText = () => {
  isShowPopup.value.textSetting = false;
};
const handleDeleteSection = () => {
  if (indexSectionSelected.value === undefined) return;
  sections.value.splice(indexSectionSelected.value, 1);
  hiddenBoxControl();
};

const defineAction = {
  showPopupSettingColor,
  showPopupSettingText,
  showPopupSettingLink,
  moveUp,
  moveDown,
  showPopupChangeImage,
  handleDeleteSection,
};

onMounted(() => {
  sections.value = [TEMPLATES_OBJ[0]];
});

const historyStatus = computed(() => ({
  redoButtonEnable: currentIndex.value !== history.value.length - 1,
  undoButtonEnable: currentIndex.value !== 0,
}));
defineExpose({
  redo,
  undo,
  historyStatus,
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 10;
  position: relative;
}
</style>
