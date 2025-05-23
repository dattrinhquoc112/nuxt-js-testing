<template>
  <img
    class="img"
    :src="props.src || ''"
    :alt="props.alt"
    @error="imageError"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
});
</script>
<style lang="scss" scoped>
.img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>
