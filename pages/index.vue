<template>
  <Tutorial :tutorial-type="TUTORIAL_TYPE.WEB_EDITOR" />
  <AIToolsTutorial />
</template>

<script setup lang="ts">
import { TUTORIAL_TYPE } from '~/constants/commom';
import AIToolsTutorial from '@/components/Tutorial/AIToolsTutorial.vue';

definePageMeta({
  layout: 'app',
});
</script>
