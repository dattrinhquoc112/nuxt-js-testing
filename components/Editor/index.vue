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
      @show-popup-change-image="showPopupChangeImage"
      @set-selected-element="(val) => (selectedElement = val)"
      @handle-change-text="handleChangeText"
      @set-hover-position="(val) => (hoverPosition = val)"
      @set-index-audio="(val) => (indexAudioSelected = val)"
    />

    <editor-box-control
      :positionControlCurrent="positionControlCurrent"
      :isShowControl="isShowControl"
      :classElementSelected="classElementSelected"
      @action-event="(key) => (defineAction[key as keyof typeof defineAction])()"
    />

    <editor-popup-setting-image
      :class="classPopupSettingImage"
      :isShow="isShowPopup.imageSetting"
      :positionControlCurrent="positionControlCurrent"
      @close="closePopupChangeImage"
      @change-image="handleChangeImage"
      @change-video="handleChangeVideo"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
    />
    <editor-popup-setting-link
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
      :isShow="isShowPopup.audioSetting"
      :positionControlCurrent="positionControlCurrent"
      v-model="objectSelecting"
      @close="closePopupSettingAudio"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
    />

    <editor-popup-setting-text
      :isShow="isShowPopup.textSetting"
      :positionControlCurrent="positionControlCurrent"
      @close="closePopupSettingText"
      @move-popup-to-top="handleMoveTopPopup"
      @move-popup-to-bottom="handleMoveBottomPopup"
      @change-align="handleChangeAlign"
      @change-size="handleChangeSize"
    />
    <editor-popup-setting-color
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
import AIToolsTutorial from '@/components/Tutorial/AIToolsTutorial.vue';

import { type RGBA } from '@/types/color';
import {
  DEBOUND_TIME_SAVE_HISTORY,
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
} from '~/types/templates';

const modelValue = ref(true);
const showSelectAITools = ref(false);
let debounceTimer: any = null;
const MAX_HISTORY = 20;
const iSaveHistory = ref(false);

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
const indexAudioSelected = ref<number>();
type SectionKeys = keyof SECTION_ITEM | keyof AUDIO_ITEM;
const keyElementSelected = ref<SectionKeys>();
const positionControlCurrent = ref<{ pageX: number; pageY: number }>({
  pageX: 0,
  pageY: 0,
});
const isChanged = ref(false);
const sections = ref<SECTION_ITEM[] | []>([]);
const history = ref<any[]>(
  JSON.parse(JSON.stringify([[props.listTemplate[0]]]))
);
const route = useRoute();
const idParam = Array.isArray(route.query?.id)
  ? route.query.id[0] || ''
  : route.query?.id || '';
const {
  fetchContentProject,
  handleSaveTemplate,
  checkMaterials,
  checkChanges,
} = useWebEditor(sections, idParam);
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
  audioSetting: false,
  colorSetting: false,
};
const isShowPopup = ref({
  ...initPopupSetting,
});

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

const classPopupSettingImage = computed(() => {
  if (keyElementSelected.value === 'backgroundSection') return 'for-bg-section';
  if (keyElementSelected.value === 'boxImage') return 'for-box-image';
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
    const oppositeColor = getOppositeColor(buttonColor.value);
    button.style.color = `rgba(${oppositeColor.r},${oppositeColor.g},${
      oppositeColor.b
    },${oppositeColor.a / 100})`;
  } else if (keyElementSelected.value !== 'backgroundSection') {
    const other = obj as TEXT_ITEM;
    other.style.color = colorChange;
  } else {
    const bg = obj as BACKGROUND_SECTION;
    bg.class = 'bg-color';
    bg.color = colorChange;
    checkMaterials(bg, '', 'DELETE');
    bg.urlVideo = '';
    bg.urlImage = '';
    bg.file = null;
    revokeObjectURL(bg.urlVideo);
    revokeObjectURL(bg.urlImage);
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
  revokeObjectURL(obj.urlVideo);
  revokeObjectURL(obj.urlImage);
  checkMaterials(obj, urlVideo);
  obj.urlImage = '';
  obj.urlVideo = urlVideo;
  obj.file = file;
  if (keyElementSelected.value === 'backgroundSection') {
    obj.class = '';
    obj.color = '';
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
  revokeObjectURL(obj.urlImage);
  revokeObjectURL(obj.urlVideo);
  checkMaterials(obj, urlImage);
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
  if (
    keyElementSelected.value !== 'backgroundSection' &&
    keyElementSelected.value !== 'boxImage' &&
    keyElementSelected.value !== 'audio'
  ) {
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

const onClickAddSection = (index: number) => {
  if (templateSelected.value) {
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
