<template>
  <Tutorial :tutorial-type="TUTORIAL_TYPE.WEB_EDITOR" />
</template>

<script setup lang="ts">
import { TUTORIAL_TYPE } from '~/constants/commom';

definePageMeta({
  layout: 'app',
});
</script>
