import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import type { MATERIAL_ITEM } from '~/types/templates';
import _ from 'lodash';
import { MethodEnum } from './interface/api';

export const useMaterial = defineStore('material', () => {
  const apiStore = useApiStore();
  const listMaterial = ref<MATERIAL_ITEM[]>([]);
  const initListMaterial = ref<MATERIAL_ITEM[]>([]);
  async function getMaterials(projectID: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects/${projectID}/materials`,
      proxy: true,
    });
  }

  const updateMaterialList = async (id: string) => {
    try {
      const res = await getMaterials(id);
      const { data } = res;
      if (data) {
        const filteredData = data.filter((item: any) => item.sectionId !== -1);
        listMaterial.value = _.cloneDeep(filteredData);
        initListMaterial.value = _.cloneDeep(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const syncInitMaterialsList = async () => {
    initListMaterial.value = _.cloneDeep(listMaterial.value);
  };
  const addMaterialContent = (materials: any) => {
    listMaterial.value.push(materials);
  };
  const updateMaterialItem = (index: number, data: any) => {
    listMaterial.value[index] = data;
  };
  const clearMaterialContent = () => {
    listMaterial.value = [];
  };
  const deleteMaterialContent = (index: number) => {
    listMaterial.value.splice(index, 1);
  };
  const concatMaterialContent = (materials: any) => {
    listMaterial.value = listMaterial.value.concat(materials);
  };
  const setListMaterials = (materials: any) => {
    listMaterial.value = materials;
  };
  const updateIndexMaterial = (indexBefore: number, indexAfter: number) => {
    listMaterial.value = listMaterial.value.map((item: MATERIAL_ITEM) => {
      if (item.indexSection === indexBefore) {
        return { ...item, indexSection: indexAfter };
      }
      if (item.indexSection === indexAfter) {
        return { ...item, indexSection: indexBefore };
      }
      return item;
    });
  };
  const removeMaterialAudio = (
    data: {
      id: string;
      text: string;
      audioUrl: string;
      isLoading: boolean;
    }[]
  ) => {
    listMaterial.value.slice(0).forEach((item: MATERIAL_ITEM) => {
      if (item.type === 'AUDIO_TTS' && item.fileUri === data[0].audioUrl) {
        listMaterial.value.splice(listMaterial.value.indexOf(item), 1);
      }
    });
  };

  const deleteIndexMaterial = (indexDelete: number) => {
    listMaterial.value = listMaterial.value
      .filter((item: MATERIAL_ITEM) => item.indexSection !== indexDelete)
      .map((item: MATERIAL_ITEM) => {
        if (
          item.indexSection !== undefined &&
          item.indexSection > indexDelete
        ) {
          return { ...item, indexSection: item.indexSection - 1 };
        }
        return item;
      });
  };

  return {
    getMaterials,
    listMaterial,
    initListMaterial,
    setListMaterials,
    addMaterialContent,
    updateMaterialItem,
    deleteMaterialContent,
    updateMaterialList,
    clearMaterialContent,
    concatMaterialContent,
    syncInitMaterialsList,
    updateIndexMaterial,
    removeMaterialAudio,
    deleteIndexMaterial,
  };
});
