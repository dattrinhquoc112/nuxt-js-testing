<template>
  <section
    v-if="section.id === 'copyright'"
    class="section-wrap section-copyright"
    @click.stop="(event) => emit('show-option', event)"
    :style="`background-color:${section.copyright.backgroundColor};`"
  >
    <div class="content-copyright">copyright © All rights reserved</div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  section: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
});

const emit = defineEmits(['show-option']);
</script>

<style></style>
