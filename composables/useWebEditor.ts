import _ from 'lodash';
import type { UPLOAD_RESPONSE } from '~/stores/interface/response/upload';
import { useUploadStore } from '@/stores/upload';
import { useProjectStore } from '~/stores/project';
import type { AUDIO_ITEM, SECTION_ITEM } from '~/types/templates';
import { THRESH_HOLD } from '~/constants/common';
import { checkReachLimit } from '~/utils/common';

export const useWebEditor = (
  sections: Ref<any[]>,
  IDWebEditor: string,
  limitFileSize?: Ref<number>,
  options?: {
    handleExceedLimit: () => void;
  }
) => {
  const idWebEditorRef = ref(IDWebEditor);
  const initSections = ref();
  const { uploadFile } = useUploadStore();
  interface MATERIAL_ITEM {
    indexSection?: number;
    id?: string | null;
    type?: string;
    thumbnail?: string;
    fileUri?: string;
    fileSize?: number | null;
    extension?: string;
  }
  const listMaterials = ref<MATERIAL_ITEM[]>([]);

  const { updateContentProject, getContentProject, setVersionContent } =
    useProjectStore();

  const checkMaterials = (
    objSelecting: any,
    newFileUri: string,
    file: File | null,
    type = 'UPDATE'
  ): Boolean => {
    if (!listMaterials.value.length) return false;
    const materialOld = listMaterials.value.find(
      (item) =>
        item.fileUri === objSelecting.urlImage ||
        item.fileUri === objSelecting.urlVideo
    );
    // Handle upload a new material
    if (!materialOld) {
      const isLimit = checkReachLimit(
        listMaterials.value,
        limitFileSize?.value || 0,
        convertToKB(`${file?.size}B`) || 0,
        THRESH_HOLD
      );
      if (isLimit) {
        options?.handleExceedLimit();
      }
      return isLimit;
    }
    // Handle remove a material
    if (type === 'DELETE') {
      listMaterials.value.splice(listMaterials.value.indexOf(materialOld), 1);
      return false;
    }
    // Handle change a material
    const differenceValue = (file?.size || 0) - (materialOld.fileSize ?? 0);
    const isLimit = checkReachLimit(
      listMaterials.value,
      limitFileSize?.value || 0,
      convertToKB(`${differenceValue}B`) || 0,
      THRESH_HOLD
    );
    if (isLimit) {
      options?.handleExceedLimit();
      return true;
    }
    materialOld.fileUri = newFileUri;
    materialOld.fileSize = file?.size;
    if (file) {
      const [, ext] = file.type.split('/');
      materialOld.extension = ext;
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
      listMaterials.value.push({
        indexSection,
        id: null,
        type,
        thumbnail: 'string',
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
    sections.value.forEach(async (item: any) => {
      if (item?.listAudio) {
        item.listAudio.forEach((itemAudio: any) => {
          if (itemAudio.audio?.file) {
            listAudio.push(itemAudio.audio);
          }
        });
      }
    });
    if (listAudio.length) {
      await Promise.all(
        listAudio.map(async (item: any, index: number) => {
          if (item?.file) {
            const res: UPLOAD_RESPONSE | undefined = await uploadFile(
              item.file
            );
            if (!res) return;
            if (item.urlImage) {
              updateMaterial(res, item.file, index, item.urlImage);
              item.urlImage = res?.fileUri;
            }
            if (item.urlVideo) {
              updateMaterial(res, item.file, index, item.urlVideo);
              item.urlVideo = res?.fileUri;
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
          audioSettings = section.listAudio?.map(
            (item: AUDIO_ITEM, orderAudio) => {
              return {
                order: orderAudio.toString(),
                audioAppProjectId: item.audio.setting.voiceModelId.value,
                speed: item.audio.setting.speed,
                pitch: item.audio.setting.pitch,
                demoPersistence: 'TEMPORARY',
                sentences: item.audio.setting.listPhrase.map((sen) => ({
                  text: sen.text,
                  fileUri: sen.audioUrl,
                  demoId: 123123,
                })),
              };
            }
          );
        }

        const materials = listMaterials.value
          .filter((i) => i.indexSection === index)
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
    listMaterials.value = [];
    if (response.data.version)
      setVersionContent({
        idProject: idWebEditorRef.value,
        version: response.data.version,
      });
    if (!response.data.sections.length) return;

    sections.value = response.data.sections.map(
      (item: any, indexSection: number) => {
        if (item.materials?.length) {
          listMaterials.value = listMaterials.value.concat(
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
    initSections.value = _.cloneDeep(sections.value);
  };

  const fetchContentProject = async () => {
    const data = await getContentProject(idWebEditorRef.value);
    mapDataToSection(data);
  };

  const handleSaveTemplate = async () => {
    await Promise.all([
      uploadAllImage('logo'),
      uploadAllImage('backgroundSection'),
      uploadAllImage('boxImage'),
      updateAllImageAudio(),
    ]);
    const payload = convertDataSections();
    const res = await updateContentProject(idWebEditorRef.value, payload);
    mapDataToSection(res);
  };
  const setIDWebEditor = (id: string) => {
    idWebEditorRef.value = id;
  };
  const checkChanges = () => {
    return _.isEqual(initSections.value, sections.value);
  };

  const updateIndexMaterial = (indexBefore: number, indexAfter: number) => {
    listMaterials.value.forEach((item: MATERIAL_ITEM) => {
      if (item.indexSection === indexBefore) {
        item.indexSection = indexAfter;
      } else if (item.indexSection === indexAfter) {
        item.indexSection = indexBefore;
      }
    });
  };

  const deleteIndexMaterial = (indexDelete: number) => {
    listMaterials.value.forEach((item: MATERIAL_ITEM) => {
      if (item.indexSection === indexDelete) {
        listMaterials.value.splice(listMaterials.value.indexOf(item), 1);
      }
    });
  };

  return {
    handleSaveTemplate,
    fetchContentProject,
    checkMaterials,
    setIDWebEditor,
    checkChanges,
    initSections,
    updateIndexMaterial,
    deleteIndexMaterial,
    listMaterials,
  };
};
