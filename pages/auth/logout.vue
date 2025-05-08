<template>
  <div />
</template>

<script setup lang="ts">
onMounted(() => {
  navigateTo(`${import.meta.env.VITE_APP_PLATFORM_URL as string}/auth/logout`, {
    external: true,
  });
});
</script>
