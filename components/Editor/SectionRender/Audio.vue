<template>
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
          <div class="audio-background">
            <editor-box-video
              v-if="audio.audio.urlVideo"
              class="video-background"
              @click.stop="clickParent"
              :urlVideo="audio.audio.urlVideo"
            />
            <img
              v-if="audio.audio.urlImage"
              class="image-background"
              @click.stop="clickParent"
              :src="getImage(audio.audio.urlImage)"
              alt=""
            />
            <div @click.stop class="icon-play">
              <vi-audio
                width="100%"
                @click:play-icon.stop="
                  emit('handle-play-audio', audio.audio.setting.voiceModelId)
                "
                :audio-file="getAudioRandom[audioIndex]"
                :show-timer="false"
                :is-show-audio-size="false"
                :is-show-status="false"
                :show-file-info="false"
              />
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

<script setup lang="ts">
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
});

const emit = defineEmits([
  'show-option',
  'handle-change-text',
  'handle-play-audio',
]);

const clickParent = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  element.parentElement?.click();
};

const getAudioRandom = computed(() => {
  return props.section.listAudio.map((audio: any) => {
    if (audio.audio.setting.listPhrase?.length) {
      const randomIndex = Math.floor(
        Math.random() * audio.audio.setting.listPhrase.length
      );
      return audio.audio.setting.listPhrase[randomIndex].audioUrl;
    }
    return '';
  });
});
</script>

<style></style>
