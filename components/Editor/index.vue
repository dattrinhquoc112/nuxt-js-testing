<template>
  <div
    :class="['container', { 'container--mobile': rwdMode === RWD_MODE.MOBILE }]"
  >
    <editor-template-selector
      v-if="
        isShowListSection === SIDE_BAR_ACTION.CLICKED_SESSION ||
        (isShowListSection === SIDE_BAR_ACTION.CLICKED_AI_TOOLS &&
          showSelectAITools)
      "
      :type="isShowListSection"
      :templateSelected="templateSelected"
      :list-template="listTemplate"
      @click-template="onClickTemplate"
      @close="emit('closeSection')"
      @handleBack="
        () => {
          modelValue = true;
          showSelectAITools = false;
        }
      "
    />

    <AIToolsTutorial
      v-model="modelValue"
      v-if="isShowListSection === SIDE_BAR_ACTION.CLICKED_AI_TOOLS"
      @handleOpenAITools="showSelectAITools = true"
      @handleCloseTooltip="emit('closeSection')"
    />

    <editor-list
      ref="editorListRef"
      :rwd-mode="rwdMode"
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
      @set-selected-element="(val) => (selectedElement = val)"
      @handle-change-text="handleChangeText"
      @set-hover-position="(val) => (hoverPosition = val)"
      @set-index-audio="(val) => (indexAudioSelected = val)"
    />
    <editor-box-control
      :positionControlCurrent="positionControlCurrent"
      :indexSectionSelected="indexSectionSelected"
      :sections="sections"
      :isShowControl="isShowControl"
      :classElementSelected="classElementSelected"
      @action-event="(key) => (defineAction[key as keyof typeof defineAction])()"
    />

    <editor-popup-setting-image
      v-if="isShowPopup.imageSetting"
      :class="classPopupSetting"
      :isShow="isShowPopup.imageSetting"
      :positionControlCurrent="positionControlCurrent"
      :is-logo="keyElementSelected === 'logo'"
      :is-audio="keyElementSelected === 'audio'"
      @reset-file="handleResetFile"
      @close="closePopupChangeImage"
      @change-image="handleChangeImage"
      @change-video="handleChangeVideo"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
    />
    <editor-popup-setting-link
      v-if="isShowPopup.addLink"
      :isShow="isShowPopup.addLink"
      :link="
        objectSelecting &&
        typeof objectSelecting === 'object' &&
        'link' in objectSelecting
          ? objectSelecting.link
          : ''
      "
      :positionControlCurrent="positionControlCurrent"
      @close="closePopupSettingLink"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
      @change-link="handleChangeLink"
    />

    <editor-popup-setting-audio
      v-if="isShowPopup.audioSetting"
      :isShow="isShowPopup.audioSetting"
      :positionControlCurrent="positionControlCurrent"
      v-model="objectSelecting"
      @add-material="addMaterialAudio"
      @remove-material="removeMaterialAudio"
      @close="closePopupSettingAudio"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
    />
    <editor-popup-setting-text
      v-if="isShowPopup.textSetting"
      :isShow="isShowPopup.textSetting"
      :positionControlCurrent="positionControlCurrent"
      @close="closePopupSettingText"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
      @change-align="handleChangeAlign"
      @change-size="handleChangeSize"
    />
    <editor-popup-setting-color
      v-if="isShowPopup.colorSetting"
      :class="classPopupSetting"
      :isShow="isShowPopup.colorSetting"
      :positionControlCurrent="positionControlCurrent"
      :elementSelected="objectSelecting"
      @close="closePopupSettingColor"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
      @change-color="(rgba:RGBA) => (buttonColor = rgba)"
    />
    <popup-reach-limit-noti v-model="isOpenReachLimitNoti" />
  </div>
</template>

<script lang="ts" setup>
import AIToolsTutorial from '@/components/Tutorial/AIToolsTutorial.vue';
import _ from 'lodash';
import { type RGBA } from '@/types/color';
import {
  DEBOUND_TIME_SAVE_HISTORY,
  MAX_HISTORY_EDITOR,
  RWD_MODE,
  SIDE_BAR_ACTION,
} from '@/constants/common';

import {
  type SECTION_ITEM,
  type AUDIO_ITEM,
  type OBJ_SECTION_ITEM,
  type BUTTON_EXTERNAL_ITEM,
  type TEXT_ITEM,
  type BACKGROUND_SECTION,
  TEMPLATES_AUDIO,
  TEMPLATES_SECTION,
  type BOX_IMAGE,
  type AUDIO_SETTING,
  type LOGO_ITEM,
  type COPYRIGHT_ITEM,
} from '~/types/templates';

definePageMeta({
  layout: 'default',
});

const props = defineProps({
  isShowListSection: {
    type: String,
    default: '',
  },
  listTemplate: {
    type: Array as PropType<any>,
    default: () => [],
  },
  rwdMode: {
    type: String,
    default: '',
  },
  limitFileSize: {
    type: Number,
    default: 0,
  },
  isExceedLimit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'closeSection',
  'handleAddSection',
  'handleExceedLimit',
]);
const isOpenReachLimitNoti = ref(false);
const modelValue = ref(true);
const showSelectAITools = ref(false);
let debounceTimer: any = null;
const iSaveHistory = ref(false);

const templateSelected = ref();
const buttonColor = ref<RGBA>({
  r: 255,
  g: 255,
  b: 255,
  a: 1,
});
const indexSectionSelected = ref<number>();
const classElementSelected = ref<string>();
const indexAudioSelected = ref<number>();
const editorListRef = ref<any>();
type SectionKeys = keyof SECTION_ITEM | keyof AUDIO_ITEM;
const keyElementSelected = ref<SectionKeys>();
const positionControlCurrent = ref<{ pageX: number; pageY: number }>({
  pageX: 0,
  pageY: 0,
});
const isChanged = ref(false);
const sections = ref<SECTION_ITEM[] | []>([]);
const history = ref<any[]>([]);
const route = useRoute();
const idParam = Array.isArray(route.query?.id)
  ? route.query.id[0] || ''
  : route.query?.id || '';
const limitSize = ref(0);
const handleExceedLimit = () => {
  isOpenReachLimitNoti.value = true;
  emit('handleExceedLimit');
};

const {
  fetchContentProject,
  handleSaveTemplate,
  checkMaterials,
  checkChanges,
  updateIndexMaterial,
  deleteIndexMaterial,
  initSections,
  listMaterials,
  addMaterialAudio,
  removeMaterialAudio,
} = useWebEditor(sections, idParam, limitSize, {
  handleExceedLimit,
  indexSectionSelected,
});

const currentIndex = ref<number>(0);
watch(
  () => props.limitFileSize,
  (newVal) => {
    limitSize.value = newVal;
  },
  {
    immediate: true,
  }
);
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
  audioSetting: false,
  colorSetting: false,
};
const isShowPopup = ref({
  ...initPopupSetting,
});
const allTemplate = TEMPLATES_SECTION.concat(TEMPLATES_AUDIO);

watch(
  initSections,
  (newVal: any[]) => {
    if (newVal) {
      history.value.push(_.cloneDeep(newVal));
    }
  },
  { immediate: true }
);
const objectSelecting = computed<OBJ_SECTION_ITEM>(() => {
  const sectionIndex = indexSectionSelected.value;
  const key = keyElementSelected.value;
  const audioIndex = indexAudioSelected.value;

  if (
    sectionIndex === undefined ||
    key === undefined ||
    sections.value[sectionIndex] === undefined
  ) {
    return undefined;
  }

  const section = sections.value[sectionIndex];

  if (audioIndex !== undefined) {
    const audioItem = section.listAudio?.[audioIndex];
    return audioItem?.[key as keyof AUDIO_ITEM];
  }

  return section?.[key as keyof SECTION_ITEM];
});

const handleSetPositionControl = (data: { pageX: number; pageY: number }) => {
  positionControlCurrent.value = data;
};

const classPopupSetting = computed(() => {
  if (keyElementSelected.value === 'backgroundSection') return 'for-bg-section';
  if (keyElementSelected.value === 'boxImage') return 'for-box-image';
  if (keyElementSelected.value === 'logo') return 'for-box-logo';
  return '';
});

watch(buttonColor, () => {
  const colorChange = `rgba(${buttonColor.value.r},${buttonColor.value.g},${
    buttonColor.value.b
  },${buttonColor.value.a / 100})`;
  const obj = objectSelecting.value;
  if (!obj) return;

  if (keyElementSelected.value === 'buttonExternal') {
    const button = obj as BUTTON_EXTERNAL_ITEM;
    button.style.backgroundColor = colorChange;
    const oppositeColor = getReadableTextColor(buttonColor.value);
    button.style.color = `rgba(${oppositeColor.r},${oppositeColor.g},${
      oppositeColor.b
    },${oppositeColor.a / 100})`;
  } else if (keyElementSelected.value === 'logo') {
    const other = obj as LOGO_ITEM;
    other.backgroundColor = colorChange;
  } else if (keyElementSelected.value === 'copyright') {
    const other = obj as COPYRIGHT_ITEM;
    other.backgroundColor = colorChange;
  } else if (keyElementSelected.value === 'backgroundSection') {
    const bg = obj as BACKGROUND_SECTION;
    bg.class = 'bg-color';
    bg.color = colorChange;
    checkMaterials({
      objSelecting: bg,
      type: 'DELETE',
    });
    bg.urlVideo = '';
    bg.urlImage = '';
    bg.file = null;
    revokeObjectURL(bg.urlVideo);
    revokeObjectURL(bg.urlImage);
  } else {
    const other = obj as TEXT_ITEM;
    other.style.color = colorChange;
  }
});

const handleChangeVideo = ({
  objectUrl: urlVideo,
  file,
}: {
  objectUrl: string;
  file: File;
}) => {
  const obj = objectSelecting.value as BACKGROUND_SECTION;
  if (!obj) return;
  const isOverStorage = checkMaterials({
    objSelecting: obj,
    newFileUri: urlVideo,
    file,
  });
  if (isOverStorage) return;
  revokeObjectURL(obj.urlVideo);
  revokeObjectURL(obj.urlImage);
  obj.urlImage = '';
  obj.urlVideo = urlVideo;
  obj.file = file;
  if (keyElementSelected.value === 'backgroundSection') {
    obj.class = '';
    obj.color = '';
  }
};
const handleResetFile = () => {
  let obj;
  if (indexSectionSelected.value === undefined) return;
  const sectionCurrent = sections.value[indexSectionSelected.value];
  const templateCurrent = allTemplate.find(
    (item) => item.id === sectionCurrent.id
  );
  if (keyElementSelected.value === 'backgroundSection') {
    obj = objectSelecting.value as BACKGROUND_SECTION;
    checkMaterials({
      objSelecting: obj,
      type: 'DELETE',
    });
    if (obj.urlImage === templateCurrent?.backgroundSection?.urlImage) {
      obj.urlImage = '';
    } else {
      obj.urlImage = templateCurrent?.backgroundSection?.urlImage;
    }
    obj.file = templateCurrent?.backgroundSection?.file;
    obj.urlVideo = templateCurrent?.backgroundSection?.urlVideo;
    obj.color = templateCurrent?.backgroundSection?.color;
    obj.class = templateCurrent?.backgroundSection?.class;
  }
  if (keyElementSelected.value === 'boxImage') {
    obj = objectSelecting.value as BOX_IMAGE;
    checkMaterials({
      objSelecting: obj,
      type: 'DELETE',
    });
    if (obj.urlImage === templateCurrent?.boxImage?.urlImage) {
      obj.urlImage = '';
    } else {
      obj.urlImage = templateCurrent?.boxImage?.urlImage;
    }
    obj.file = templateCurrent?.boxImage?.file;
    obj.urlVideo = templateCurrent?.boxImage?.urlVideo;
  }
  if (keyElementSelected.value === 'audio') {
    obj = objectSelecting.value as AUDIO_SETTING;
    checkMaterials({
      objSelecting: obj,
      type: 'DELETE',
    });
    if (obj.urlImage === templateCurrent?.listAudio?.[0]?.audio.urlImage) {
      obj.urlImage = '';
    } else {
      obj.urlImage = templateCurrent?.listAudio?.[0]?.audio.urlImage;
    }
    obj.file = templateCurrent?.listAudio?.[0]?.audio.file;
    obj.urlVideo = templateCurrent?.listAudio?.[0]?.audio.urlVideo;
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
  editorListRef.value?.calcPositionLabel();

  textarea.addEventListener('blur', () => {
    const obj = objectSelecting.value as TEXT_ITEM;
    if (!obj) return;
    obj.text = textarea.value;
    element.textContent = textarea.value;
  });
};
const handleChangeImage = ({
  objectUrl: urlImage,
  file,
}: {
  objectUrl: string;
  file: File;
}) => {
  const obj = objectSelecting.value as BACKGROUND_SECTION;
  if (!obj) return;
  const isOverStorage = checkMaterials({
    objSelecting: obj,
    newFileUri: urlImage,
    file,
  });
  if (isOverStorage) return;
  revokeObjectURL(obj.urlImage);
  revokeObjectURL(obj.urlVideo);
  obj.urlVideo = '';
  obj.file = file;
  obj.urlImage = urlImage;
  if (keyElementSelected.value === 'backgroundSection') {
    obj.class = 'bg-img';
    obj.color = '';
  }
};
const handleChangeAlign = (align: string) => {
  const obj = objectSelecting.value as TEXT_ITEM;
  if (!obj) return;
  obj.style.textAlign = align;
};

const handleChangeSize = (size: string) => {
  const obj = objectSelecting.value as TEXT_ITEM;
  if (!obj) return;
  obj.style.fontSize = size;
};

const handleChangeLink = (link: string) => {
  const obj = objectSelecting.value as BUTTON_EXTERNAL_ITEM;
  if (!obj || !link) return;
  obj.link = link;
};
const calcPositionControl = (distance: number) => {
  editorListRef.value?.calcPositionLabel();
  handleSetPositionControl({
    pageX: positionControlCurrent.value.pageX,
    pageY: positionControlCurrent.value.pageY - distance,
  });
};

const handleMoveTopPopup = () => {
  if (!selectedElement.value) return;
  if (
    keyElementSelected.value !== 'backgroundSection' &&
    keyElementSelected.value !== 'boxImage' &&
    keyElementSelected.value !== 'audio'
  ) {
    const coordinates = selectedElement.value.getBoundingClientRect();
    const pageY = coordinates.top - 12;
    const pageX = coordinates.left + coordinates.width / 2;
    handleSetPositionControl({
      pageY,
      pageX,
    });
  }
  boxControlElement.value?.classList.remove('show-on-bottom');
  boxControlElement.value?.classList.add('show-on-top');
};
const handleMoveBottomPopup = () => {
  if (!selectedElement.value) return;
  if (
    keyElementSelected.value !== 'backgroundSection' &&
    keyElementSelected.value !== 'boxImage' &&
    keyElementSelected.value !== 'audio'
  ) {
    const coordinates = selectedElement.value.getBoundingClientRect();
    const pageY = coordinates.bottom + 12;
    const pageX = coordinates.left + coordinates.width / 2;
    handleSetPositionControl({
      pageY,
      pageX,
    });
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
};

const moveDown = () => {
  if (indexSectionSelected.value === undefined) return;
  if (indexSectionSelected.value === sections.value.length - 2) return;
  if (sections.value.length < 2) return;
  if (indexSectionSelected.value < sections.value.length - 1) {
    const templateDraft = sections.value[indexSectionSelected.value];
    sections.value[indexSectionSelected.value] =
      sections.value[indexSectionSelected.value + 1];
    sections.value[indexSectionSelected.value + 1] = templateDraft;
    updateIndexMaterial(
      indexSectionSelected.value,
      indexSectionSelected.value + 1
    );
  }
};

const moveUp = () => {
  if (indexSectionSelected.value === undefined) return;
  if (indexSectionSelected.value === 1) return;
  if (sections.value.length < 2) return;
  if (indexSectionSelected.value !== 0) {
    const templateDraft = sections.value[indexSectionSelected.value];
    sections.value[indexSectionSelected.value] =
      sections.value[indexSectionSelected.value - 1];
    sections.value[indexSectionSelected.value - 1] = templateDraft;
    updateIndexMaterial(
      indexSectionSelected.value,
      indexSectionSelected.value - 1
    );
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
    isChanged.value = true;
    if (iSaveHistory.value) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (currentIndex.value < history.value.length) {
        history.value = history.value.slice(0, currentIndex.value + 1);
      }

      debounceTimer = setTimeout(() => {
        history.value.push(JSON.parse(JSON.stringify(newVal)));
        currentIndex.value++;
        if (history.value.length > MAX_HISTORY_EDITOR + 1) {
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

const onClickAddSection = (index: number) => {
  if (props.isExceedLimit) {
    emit('handleAddSection');
  } else if (templateSelected.value && !props.isExceedLimit) {
    const newIndex = hoverPosition.value?.zone === 'bottom' ? index + 1 : index;
    sections.value.splice(
      newIndex,
      0,
      JSON.parse(JSON.stringify(templateSelected.value))
    );
    iSaveHistory.value = true;
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
const showPopupSettingAudio = () => {
  isShowControl.value = false;
  positionControlCurrent.value.pageY = 80;
  isShowPopup.value.audioSetting = true;
};
const closePopupSettingAudio = () => {
  isShowPopup.value.audioSetting = false;
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
  deleteIndexMaterial(indexSectionSelected.value);
  iSaveHistory.value = true;
  hiddenBoxControl();
};

const defineAction = {
  showPopupSettingColor,
  showPopupSettingText,
  showPopupSettingLink,
  showPopupSettingAudio,
  moveUp,
  moveDown,
  showPopupChangeImage,
  handleDeleteSection,
};

const historyStatus = computed(() => ({
  redoButtonEnable: currentIndex.value !== history.value.length - 1,
  undoButtonEnable: currentIndex.value !== 0,
}));

onMounted(() => {
  fetchContentProject();
});

defineExpose({
  redo,
  undo,
  historyStatus,
  hiddenBoxControl,
  handleSaveTemplate,
  fetchContentProject,
  sections,
  checkChanges,
  listMaterials,
  calcPositionControl,
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 10;
  position: relative;
  &--mobile {
    width: 375px;
  }
}
</style>
