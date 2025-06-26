import _ from 'lodash';
import type { UPLOAD_RESPONSE } from '~/stores/interface/response/upload';
import { useUploadStore } from '@/stores/upload';
import { useProjectStore } from '~/stores/project';
import type { AUDIO_ITEM, SECTION_ITEM } from '~/types/templates';
import { THRESH_HOLD } from '~/constants/common';
import useSnapshotThumbnail from '@/composables/snapshotThumbnail';
import { checkReachLimit } from '~/utils/common';
import { useMaterial } from '~/stores/material';
import { storeToRefs } from 'pinia';

export const useWebEditor = (
  sections: Ref<any[]>,
  IDWebEditor: string,
  limitFileSize?: any,
  currentSizeRef?: any,
  options?: {
    handleExceedLimit: () => void;
    handleExceed75PercentLimit: () => void;
    indexSectionSelected: Ref<number | undefined>;
  }
) => {
  const materialStore = useMaterial();
  const { listMaterial: listMaterials } = storeToRefs(materialStore);
  const currentSize = ref({ value: 0 });
  watch(
    () => currentSizeRef?.value,
    (newVal) => {
      currentSize.value = newVal;
    }
  );

  const idWebEditorRef = ref(IDWebEditor);
  const initSections = ref();
  const { uploadFile } = useUploadStore();

  const { updateContentProject, getContentProject, setVersionContent } =
    useProjectStore();
  const { handleGetThumbnailSnapshot } = useSnapshotThumbnail();

  const checkMaterials = ({
    objSelecting,
    newFileUri = '',
    file = null,
    type = 'UPDATE',
  }: {
    objSelecting: any;
    newFileUri?: string;
    file?: File | null;
    type?: string;
  }): Boolean => {
    const materialOld = listMaterials.value.find(
      (item) =>
        Boolean(item.fileUri) &&
        (item.fileUri === objSelecting.urlImage ||
          item.fileUri === objSelecting.urlVideo)
    );

    // Handle upload a new material
    if (!materialOld && type !== 'DELETE') {
      const isReach75PercentLimit = checkReachLimit(
        currentSize?.value?.value || 0,
        limitFileSize?.value?.value || 0,
        file?.size || 0,
        THRESH_HOLD
      );
      const isLimit = checkReachLimit(
        currentSize?.value?.value || 0,
        limitFileSize?.value?.value || 0,
        file?.size || 0,
        1
      );
      if (isLimit) {
        options?.handleExceedLimit();
      } else {
        if (options?.indexSectionSelected?.value === undefined) return isLimit;
        const [, ext] = file?.type.split('/') || '';
        materialStore.addMaterialContent({
          indexSection: options.indexSectionSelected.value,
          type: 'MEDIA',
          id: null,
          fileUri: newFileUri,
          fileSize: file?.size,
          extension: ext,
        });
        if (isReach75PercentLimit) {
          options?.handleExceed75PercentLimit();
        }
      }
      return isLimit;
    }
    if (!materialOld) return false;
    // Handle remove a material

    const materialIndex = listMaterials.value.indexOf(materialOld);
    if (type === 'DELETE') {
      materialStore.deleteMaterialContent(materialIndex);
      return false;
    }
    // Handle change a material
    const differenceValue = (file?.size || 0) - (materialOld.fileSize ?? 0);
    const isLimit = checkReachLimit(
      currentSize?.value?.value || 0,
      limitFileSize?.value?.value || 0,
      differenceValue || 0,
      1
    );
    const isReach75PercentLimit = checkReachLimit(
      currentSize?.value?.value || 0,
      limitFileSize?.value?.value || 0,
      file?.size || 0,
      THRESH_HOLD
    );
    if (isLimit) {
      options?.handleExceedLimit();
    }

    let newData = {
      ...materialOld,
      fileUri: newFileUri,
      fileSize: file?.size,
    };
    if (file) {
      const [, ext] = file.type.split('/');
      materialOld.extension = ext;
      newData = { ...newData, extension: ext };
    }
    materialStore.updateMaterialItem(materialIndex, newData);
    if (isReach75PercentLimit) {
      options?.handleExceed75PercentLimit();
    }
    return false;
  };

  const updateMaterial = (
    dataApi: UPLOAD_RESPONSE,
    file: File,
    indexSection: number,
    fileUri: string,
    type: string = 'MEDIA'
  ) => {
    const findMaterial = listMaterials.value.find(
      (item) => item.fileUri === fileUri
    );

    if (findMaterial) {
      findMaterial.indexSection = indexSection;
      findMaterial.type = type;
      findMaterial.fileUri = dataApi.fileUri;
      findMaterial.fileSize = file.size;
    } else {
      materialStore.addMaterialContent({
        indexSection,
        id: null,
        type,
        thumbnail: dataApi.fileUri,
        fileUri: dataApi.fileUri,
        fileSize: file.size,
      });
    }
  };

  const uploadAllImage = async (key: string, type: string = 'MEDIA') => {
    if (!sections.value.length) return;

    await Promise.all(
      sections.value.map(async (item: any, index: number) => {
        if (item?.[key]?.file) {
          const res: UPLOAD_RESPONSE | undefined = await uploadFile(
            item[key].file
          );
          if (!res) return;
          if (item[key].urlImage) {
            updateMaterial(
              res,
              item[key].file,
              index,
              item[key].urlImage,
              type
            );
            item[key].urlImage = res?.fileUri;
          }
          if (item[key].urlVideo) {
            updateMaterial(
              res,
              item[key].file,
              index,
              item[key].urlVideo,
              type
            );
            item[key].urlVideo = res?.fileUri;
          }
        }
      })
    );
  };

  const updateAllImageAudio = async () => {
    if (!sections.value.length) return;
    const listAudio: any[] = [];
    sections.value.forEach(async (item: any, index: number) => {
      if (item?.listAudio) {
        item.listAudio.forEach((itemAudio: any) => {
          if (itemAudio.audio?.file) {
            listAudio.push({ ...itemAudio.audio, indexSection: index });
          }
        });
      }
    });
    if (listAudio.length) {
      await Promise.all(
        listAudio.map(async (item: any, indexAudio) => {
          if (item?.file) {
            const res: UPLOAD_RESPONSE | undefined = await uploadFile(
              item.file
            );
            if (!res) return;
            if (item.urlImage) {
              updateMaterial(res, item.file, item.indexSection, item.urlImage);
              sections.value[item.indexSection].listAudio[
                indexAudio
              ].audio.urlImage = res?.fileUri;
            }
            if (item.urlVideo) {
              updateMaterial(res, item.file, item.indexSection, item.urlVideo);
              sections.value[item.indexSection].listAudio[
                indexAudio
              ].audio.urlVideo = res?.fileUri;
            }
          }
        })
      );
    }
  };

  const convertDataSections = () => {
    return {
      sections: sections.value.map((section: SECTION_ITEM, index: number) => {
        let audioSettings: any = [];
        if (section.id === 'audio-section') {
          audioSettings = section.listAudio?.flatMap(
            (item: AUDIO_ITEM, orderAudio) => {
              if (
                !item.audio.setting.voiceModelId?.value ||
                !item.audio.setting.listPhrase?.length ||
                !item.audio.setting.listPhrase.some((itemVoice) => itemVoice.id)
              ) {
                return [];
              }
              item.audio.setting.listPhrase =
                item.audio.setting.listPhrase.filter((s) =>
                  Boolean(s.audioUrl && s.id)
                );
              return {
                order: orderAudio.toString(),
                audioAppProjectId: item.audio.setting.voiceModelId.value,
                speed: item.audio.setting.speed,
                pitch: item.audio.setting.pitch,
                sentences: item.audio.setting.listPhrase.map((sen) => ({
                  text: sen.text,
                  fileUri: sen.audioUrl,
                  demoId: sen.id,
                })),
              };
            }
          );
        }
        const materials = listMaterials.value
          .filter((i) => Number(i.indexSection) === index)
          .map((i) => ({
            id: i.id,
            type: i.type,
            thumbnail: i.thumbnail,
            fileUri: i.fileUri,
            fileSize: i.fileSize,
          }));
        return {
          id: section?.idApi || null,
          template: section.id,
          order: index,
          settings: {
            generalSettings: resetAllFileToNull(section),
            audioSettings,
          },
          materials,
        };
      }),
    };
  };

  const mapDataToSection = (response: any) => {
    materialStore.clearMaterialContent();
    if (response.data.version)
      setVersionContent({
        idProject: idWebEditorRef.value,
        version: response.data.version,
      });
    if (!response.data.sections.length) return;

    sections.value = response.data.sections.map(
      (item: any, indexSection: number) => {
        if (item.materials?.length) {
          materialStore.concatMaterialContent(
            item.materials.map((i: any) => ({
              indexSection,
              id: i.id,
              type: i.type,
              thumbnail: i.thumbnail,
              fileUri: i.fileUri,
              fileSize: i.fileSize,
            }))
          );
        }
        return { ...item.settings.generalSettings, idApi: item.id };
      }
    );
    materialStore.syncInitMaterialsList();
    initSections.value = _.cloneDeep(sections.value);
  };

  const fetchContentProject = async () => {
    const data = await getContentProject(idWebEditorRef.value);
    mapDataToSection(data);
  };

  const handleSaveTemplate = async ({
    isGetThumbnail = false,
  }: {
    isGetThumbnail?: boolean;
  }) => {
    let file = null;
    if (isGetThumbnail) {
      file = await handleGetThumbnailSnapshot();
    }
    await Promise.all([
      uploadAllImage('logo'),
      uploadAllImage('backgroundSection'),
      uploadAllImage('boxImage'),
      updateAllImageAudio(),
    ]);
    const payload = convertDataSections();
    const res = await updateContentProject(idWebEditorRef.value, payload);
    mapDataToSection(res);
    return file;
  };
  const setIDWebEditor = (id: string) => {
    idWebEditorRef.value = id;
  };
  const checkChanges = () => {
    return _.isEqual(initSections.value, sections.value);
  };

  const checkIsFinishedSetupAudio = () => {
    return sections.value.every((section: SECTION_ITEM) => {
      if (section.id === 'audio-section') {
        let isSettingAudio: boolean = false;
        if (!section.listAudio?.length) return false;
        isSettingAudio = section.listAudio?.every((item: AUDIO_ITEM) => {
          if (
            !item.audio.setting.voiceModelId?.value ||
            !item.audio.setting.listPhrase?.length ||
            !item.audio.setting.listPhrase.every((itemVoice) => itemVoice.id)
          ) {
            return false;
          }
          return true;
        });
        return isSettingAudio;
      }
      return true;
    });
  };

  const getSizeFileFromUri = (uri: string) => {
    return fetch(uri, { method: 'HEAD' }).then((response) => {
      const fileSize = response.headers.get('content-length');
      return fileSize;
    });
  };

  const addMaterialAudio = async (
    data: {
      id: string;
      text: string;
      audioUrl: string;
      isLoading: boolean;
    },
    sectionAudioSelected: SECTION_ITEM
  ) => {
    const fileSize = await getSizeFileFromUri(data.audioUrl);
    if (!fileSize) {
      return;
    }
    const isReach75PercentLimit = checkReachLimit(
      currentSize?.value?.value || 0,
      limitFileSize?.value?.value || 0,
      convertToKB(`${fileSize}B`) || 0,
      THRESH_HOLD
    );
    const isLimit = checkReachLimit(
      currentSize?.value?.value || 0,
      limitFileSize?.value?.value || 0,
      convertToKB(`${fileSize}B`) || 0,
      1
    );
    if (isLimit) {
      options?.handleExceedLimit();
    } else {
      materialStore.addMaterialContent({
        indexSection: options?.indexSectionSelected?.value,
        type: 'AUDIO_TTS',
        thumbnail: sectionAudioSelected?.imageDemo,
        fileUri: data.audioUrl,
        fileSize: convertToKB(`${fileSize}B`),
      });
      if (isReach75PercentLimit) {
        options?.handleExceed75PercentLimit();
      }
    }
  };

  return {
    handleSaveTemplate,
    fetchContentProject,
    checkMaterials,
    setIDWebEditor,
    checkChanges,
    initSections,
    listMaterials,
    addMaterialAudio,
    checkIsFinishedSetupAudio,
  };
};
