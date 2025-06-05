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
        v-bind="getLinkForButton"
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
        v-bind="getLinkForButton"
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
        @click.stop="clickParent"
        v-if="section.boxImage.urlImage"
        :src="getImage(section.boxImage.urlImage)"
      />
      <editor-box-video
        class="right-section-video-background"
        @click.stop="clickParent"
        :urlVideo="section.boxImage.urlVideo"
      />
    </div>
  </section>
  <section
    v-if="section.id === 'audio-section'"
    class="section-wrap section-audio"
    @click.stop="(event) => emit('show-option', event)"
    :class="[
      section.backgroundSection.class,
      {
        'section-audio--mobile': rwdMode === RWD_MODE.MOBILE,
        'section-audio--mobile__1':
          section.listAudio.length === 1 && rwdMode === RWD_MODE.MOBILE,
        'section-audio--mobile__2':
          section.listAudio.length === 2 && rwdMode === RWD_MODE.MOBILE,
        'section-audio--mobile__3':
          section.listAudio.length === 3 && rwdMode === RWD_MODE.MOBILE,
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
    <div class="wrap-content">
      <div
        class="text-title"
        :style="section?.textTitle.style"
        @dblclick="(event) => emit('handle-change-text', event)"
      >
        {{ section?.textTitle?.text }}
      </div>
      <div class="list-audio">
        <div
          v-for="(audio, audioIndex) in section.listAudio"
          :key="audioIndex"
          class="card-audio"
          :data-index="audioIndex"
        >
          <div class="audio-image">
            <editor-box-video
              v-if="audio.audio.urlVideo"
              class="video-background"
              @click.stop="clickParent"
              :urlVideo="audio.audio.urlVideo"
            />
            <img
              v-else
              @click.stop="clickParent"
              :src="getImage(audio.audio.urlImage)"
              alt=""
            />
            <div class="icon-play">
              <vi-icon name="ic_play" size="24" color="#000" />
            </div>
          </div>
          <div
            class="audio-text-subtitle"
            :style="audio?.textSubtitle.style"
            @dblclick="(event) => emit('handle-change-text', event)"
          >
            {{ audio.textSubtitle.text }}
          </div>
          <div
            class="audio-text-product"
            :style="audio?.textProduction.style"
            @dblclick="(event) => emit('handle-change-text', event)"
          >
            {{ audio.textProduction.text }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import useProjects from '~/composables/projects';

import { RWD_MODE } from '@/constants/common';

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
const emit = defineEmits(['show-option', 'handle-change-text']);
const clickParent = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  element.parentElement?.click();
};
const { getImage } = useProjects();

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
