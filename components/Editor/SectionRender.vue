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
    :style="`--bg-image:url(${getImage(
      section.backgroundSection.urlImage
    )});--bg-color:${section.backgroundSection.color};`"
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
      <source :src="getImage(section.backgroundSection.urlVideo)" />
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
    :style="`--bg-image:url(${getImage(
      section.backgroundSection.urlImage
    )});--bg-color:${section.backgroundSection.color};`"
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
      <source :src="getImage(section.backgroundSection.urlVideo)" />
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
        v-if="section.boxImage.urlImage"
        :src="getImage(section.boxImage.urlImage)"
      />
      <video
        v-if="section.boxImage.urlVideo"
        :key="section.boxImage.urlVideo"
        class="right-section-video-background"
        autoplay
        muted
        loop
        playsinline
        @click.stop="clickParent"
      >
        <source :src="getImage(section.boxImage.urlVideo)" />
      </video>
    </div>
  </section>
  <section
    v-if="section.id === 'audio-section'"
    class="section-wrap section-audio"
    @click.stop="(event) => emit('show-option', event)"
    :class="[
      section.backgroundSection.class,
      // {
      //   'section-audio--mobile': rwdMode === RWD_MODE.MOBILE,
      //   'section-audio--mobile__1':
      //     section.listAudio.length === 1 && rwdMode === RWD_MODE.MOBILE,
      //   'section-audio--mobile__2':
      //     section.listAudio.length === 2 && rwdMode === RWD_MODE.MOBILE,
      //   'section-audio--mobile__3':
      //     section.listAudio.length === 3 && rwdMode === RWD_MODE.MOBILE,
      // },
    ]"
    :style="`--bg-image:url(${getImage(
      section.backgroundSection.urlImage
    )});--bg-color:${section.backgroundSection.color};`"
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
      <source :src="getImage(section.backgroundSection.urlVideo)" />
    </video>
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
            <video
              v-if="audio.audio.urlVideo"
              :key="audio.audio.urlVideo"
              class="video-background"
              autoplay
              muted
              loop
              playsinline
              @click.stop="clickParent"
            >
              <source :src="getImage(audio.audio.urlVideo)" />
            </video>
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
const { getImage } = useProjects();
</script>

<style></style>
