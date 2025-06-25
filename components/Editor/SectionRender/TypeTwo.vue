<template>
  <section
    v-if="
      section?.id === 'section-two' || section?.id === 'section-two-reverse'
    "
    class="section-wrap section-two"
    @click.stop="(event) => emit('show-option', event)"
    :class="[
      `${section.backgroundSection.class} ${
        section?.id === 'section-two-reverse' ? 'reverse' : ''
      }`,
      {
        'section-two--mobile': rwdMode === RWD_MODE.MOBILE,
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
    <div class="left">
      <div
        class="text-head"
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
      <a
        class="button-href"
        v-bind="linkButton"
        :style="section?.buttonExternal.style"
        @dblclick="(event) => emit('handle-change-text', event)"
        >{{ section?.buttonExternal?.text }}</a
      >
    </div>

    <div
      class="right right-section-image"
      :class="section?.id === 'section-two-reverse' ? 'reverse' : ''"
    >
      <img
        class="tag-right-section-image"
        @click.stop="clickParent"
        v-if="section.boxImage.urlImage"
        :src="getImage(section.boxImage.urlImage)"
      />
      <editor-box-video
        class="right-section-video-background"
        @click.stop="clickParent"
        is-type-video="box-section-two"
        :urlVideo="section.boxImage.urlVideo"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
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

const emit = defineEmits(['show-option', 'handle-change-text']);

const clickParent = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  element.parentElement?.click();
};
</script>

<style></style>
