<template>
  <Tutorial :tutorial-type="TUTORIAL_TYPE.HOME_PAGE" />
</template>

<script setup lang="ts">
import { TUTORIAL_TYPE } from '~/constants/common';

definePageMeta({
  layout: 'app',
});
</script>
