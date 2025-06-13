<template>
  <section-logo
    :section="section"
    @show-option="(event:any) => emit('show-option', event)"
  />

  <section-type-one
    :section="section"
    :link-button="getLinkForButton"
    :rwd-mode="rwdMode"
    @show-option="(event:any) => emit('show-option', event)"
    @handle-change-text="(event:any) => emit('handle-change-text', event)"
  />

  <section-type-two
    :section="section"
    :link-button="getLinkForButton"
    :rwd-mode="rwdMode"
    @show-option="(event:any) => emit('show-option', event)"
    @handle-change-text="(event:any) => emit('handle-change-text', event)"
  />

  <section-audio
    :section="section"
    :rwd-mode="rwdMode"
    @handle-play-audio="(data) => emit('handle-play-audio', data)"
    @show-option="(event:any) => emit('show-option', event)"
    @handle-change-text="(event:any) => emit('handle-change-text', event)"
  />

  <section-copyright
    :section="section"
    @show-option="(event:any) => emit('show-option', event)"
  />
</template>

<script lang="ts" setup>
import SectionLogo from './Logo.vue';
import SectionTypeOne from './TypeOne.vue';
import SectionTypeTwo from './TypeTwo.vue';
import SectionAudio from './Audio.vue';
import SectionCopyright from './Copyright.vue';

defineComponent({
  SectionLogo,
  SectionTypeOne,
  SectionTypeTwo,
  SectionAudio,
  SectionCopyright,
});

const props = defineProps({
  section: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  rwdMode: {
    type: String,
    default: '',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  'show-option',
  'handle-change-text',
  'handle-play-audio',
]);

const getLinkForButton = computed(() => {
  if (!props.isPublic && !props.readOnly) return {};
  return {
    href: props.section?.buttonExternal?.link
      ? props.section?.buttonExternal?.link
      : '#',
    target: '_blank',
  };
});
</script>

<style></style>
