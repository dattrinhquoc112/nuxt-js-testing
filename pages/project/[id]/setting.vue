<template>
  <popup-setting-project
    v-if="!loading.detail && model.project"
    :show="true"
    :project="model.project"
  />
</template>
<script setup lang="ts">
import { useProjectStore } from '~/stores/project';
import type { IProject } from '~/types/project';

interface Model {
  project?: IProject;
}

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
});

const route = useRoute();
const id = route.params.id as string;

const loading = reactive({
  detail: true,
});

const model = reactive<Model>({});

const { getProject } = useProjectStore();

const fetchProject = async () => {
  loading.detail = true;
  const res = await getProject(id);
  model.project = res.data;
  loading.detail = false;
};

onMounted(() => {
  fetchProject();
});
</script>
