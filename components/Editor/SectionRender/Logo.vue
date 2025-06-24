<template>
  <section
    v-if="section.id === 'logo'"
    class="section-wrap section-logo"
    @click.stop="(event) => emit('show-option', event)"
    :style="`background-color:${section.logo.backgroundColor};`"
  >
    <div class="section-logo-wrap">
      <img
        class="section-logo-image"
        :src="getImage(section.logo.urlImage)"
        alt=""
      />
    </div>
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
