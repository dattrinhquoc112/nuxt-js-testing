<template>
  <div v-if="loaded">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { useState } from '#app';

const loaded = useState('pluginLoaded', () => false);
</script>
