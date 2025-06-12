<template>
  <section
    v-if="
      section?.id === 'section-one-center' ||
      section?.id === 'section-one-left' ||
      section?.id === 'section-one-right'
    "
    @click.stop="(event) => emit('show-option', event)"
    class="section-wrap section-one"
    :class="[
      section.backgroundSection.class,
      {
        'section-one--mobile': rwdMode === RWD_MODE.MOBILE,
      },
    ]"
    :style="`--bg-image:url(${getImage(
      section.backgroundSection.urlImage
    )});--bg-color:${section.backgroundSection.color};`"
  >
    <editor-box-video
      class="video-background"
      @click.stop="clickParent"
      :urlVideo="section.backgroundSection.urlVideo"
    />

    <div
      :class="[
        section?.id === 'section-one-center'
          ? 'center'
          : section?.id === 'section-one-left'
          ? 'left'
          : section?.id === 'section-one-right'
          ? 'right'
          : '',
        {
          'content--destop': rwdMode === RWD_MODE.DESKTOP,
          'content--mobile': rwdMode === RWD_MODE.MOBILE,
        },
      ]"
    >
      <div
        class="text-head"
        v-if="section?.id === 'section-one-center'"
        :style="section?.textProduct.style"
        @dblclick="(event) => emit('handle-change-text', event)"
      >
        {{ section?.textProduct?.text }}
      </div>
      <div
        class="text-title"
        :style="section?.textTitle.style"
        @dblclick="(event) => emit('handle-change-text', event)"
      >
        {{ section?.textTitle?.text }}
      </div>
      <div
        v-if="
          section?.id === 'section-one-left' ||
          section?.id === 'section-one-right'
        "
        class="text-des"
        :style="section?.textDes.style"
        @dblclick="(event) => emit('handle-change-text', event)"
      >
        {{ section?.textDes?.text }}
      </div>
      <a
        class="button-href"
        v-bind="linkButton"
        :style="section?.buttonExternal.style"
        @dblclick="(event) => emit('handle-change-text', event)"
      >
        {{ section?.buttonExternal?.text }}</a
      >
    </div>
  </section>
</template>

<script setup lang="ts">
import useProjects from '~/composables/projects';
import { RWD_MODE } from '@/constants/common';

defineProps({
  section: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  rwdMode: {
    type: String,
    default: '',
  },
  linkButton: {
    type: Object,
    default: () => ({}),
  },
});

const { getImage } = useProjects();

const emit = defineEmits(['show-option', 'handle-change-text']);

const clickParent = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  element.parentElement?.click();
};
</script>

<style></style>
