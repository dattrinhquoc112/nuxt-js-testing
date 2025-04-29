<template>
  <div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
const title = ref('test');
</script>

<style scoped lang="scss">
.title {
  color: $green;
}
</style>
