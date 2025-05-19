<template>
  <section
    v-if="
      section?.id === 'section-one-center' ||
      section?.id === 'section-one-left' ||
      section?.id === 'section-one-right'
    "
    @click.stop="(event) => emit('show-option', event)"
    class="section-wrap section-one"
    :class="section.backgroundSection.class"
    :style="`--bg-image:url(${section.backgroundSection.urlImg});--bg-color:${section.backgroundSection.color};`"
  >
    <video
      v-if="section.backgroundSection.urlVideo"
      :key="section.backgroundSection.urlVideo"
      @click.stop="clickParent"
      class="video-background"
      autoplay
      muted
      loop
      playsinline
    >
      <source :src="section.backgroundSection.urlVideo" />
    </video>

    <div
      class="content"
      :class="
        section?.id === 'section-one-center'
          ? 'center'
          : section?.id === 'section-one-left'
          ? 'left'
          : section?.id === 'section-one-right'
          ? 'right'
          : ''
      "
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
        :style="section?.buttonExternal.style"
        @dblclick="(event) => emit('handle-change-text', event)"
      >
        {{ section?.buttonExternal?.text }}</a
      >
    </div>
  </section>
  <section
    v-if="
      section?.id === 'section-two' || section?.id === 'section-two-reverse'
    "
    class="section-wrap section-two"
    @click.stop="(event) => emit('show-option', event)"
    :class="`${section.backgroundSection.class} ${
      section?.id === 'section-two-reverse' ? 'reverse' : ''
    }`"
    :style="`--bg-image:url(${section.backgroundSection.urlImg});--bg-color:${section.backgroundSection.color};`"
  >
    <video
      v-if="section.backgroundSection.urlVideo"
      :key="section.backgroundSection.urlVideo"
      class="video-background"
      autoplay
      muted
      loop
      playsinline
      @click.stop="clickParent"
    >
      <source :src="section.backgroundSection.urlVideo" />
    </video>
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
        :style="section?.buttonExternal.style"
        @dblclick="(event) => emit('handle-change-text', event)"
        >{{ section?.buttonExternal?.text }}</a
      >
    </div>

    <div class="right right-section-image">
      <img
        @click.stop="clickParent"
        v-if="section.boxImage.imgUrl"
        :src="section.boxImage.imgUrl"
      />
      <video
        v-if="section.boxImage.imgVideo"
        :key="section.boxImage.imgVideo"
        class="right-section-video-background"
        autoplay
        muted
        loop
        playsinline
        @click.stop="clickParent"
      >
        <source :src="section.boxImage.imgVideo" />
      </video>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps({
  section: {
    type: Object as PropType<any>,
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
