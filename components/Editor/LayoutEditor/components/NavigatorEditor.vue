<template>
  <div class="editor-layout">
    <vi-navigation-top
      :parts="[
        { name: 'first', type: 'leading' },
        { name: 'second', type: 'leading' },
        { name: 'third', type: 'leading' },
      ]"
    >
      <template #first>
        <div class="editor-layout__left">
          <vi-icon
            name="ic_chevron_left"
            size="24"
            color="#fff"
            class="editor-layout__left__back"
          />
          <vi-typography type="headline-xs" class="editor-layout__left__text">
            未命名專案
          </vi-typography>
          <vi-icon
            name="ic_chevron_down"
            size="16"
            color="#fff"
            class="editor-layout__left__dropdown"
          />
        </div>
      </template>
      <template #second>
        <div class="editor-layout__center">
          <vi-button
            type="standard-subtle"
            icon-before="ic_step_back"
            no-text
            @click="$emit('handleRedo')"
          ></vi-button>
          <vi-button
            type="standard-subtle"
            icon-before="ic_step_next"
            no-text
            @click="$emit('handleUndo')"
          ></vi-button>
        </div>
      </template>
      <template #third>
        <div class="editor-layout__right">
          <div class="button__switcher">
            <vi-button
              type="standard-subtle"
              icon-before="ic_device_desktop"
              no-text
              size="24"
              :class="{ active: activeDevice === DEVICES.destop }"
              :text-color="activeDevice === DEVICES.destop ? '#030C11' : '#fff'"
              @click="handleSwitchLayout(DEVICES.destop)"
            ></vi-button>

            <vi-button
              type="standard-subtle"
              icon-before="ic_device_mobile"
              no-text
              size="24"
              :class="{ active: activeDevice === DEVICES.mobile }"
              :text-color="activeDevice === DEVICES.mobile ? '#030C11' : '#fff'"
              @click="handleSwitchLayout(DEVICES.mobile)"
            ></vi-button>
          </div>
          <vi-button
            icon-before="ic_play"
            no-text
            color="#fff"
            @click="$emit('handlePlay')"
          />
          <vi-button
            width="fit-content"
            type="standard-primary"
            @click="$emit('hanldeStoreChanges')"
          >
            <vi-typography type="subtitle-large" class="cursor-pointer">
              {{ $t('storage_changes') }}
            </vi-typography>
          </vi-button>
          <vi-button
            width="fit-content"
            type="standard-primary"
            @click="$emit('handleRelease')"
          >
            <vi-typography type="subtitle-large" class="cursor-pointer">
              {{ $t('release') }}
            </vi-typography>
          </vi-button>
        </div>
      </template>
    </vi-navigation-top>
  </div>
</template>
<script setup lang="ts">
const DEVICES = {
  destop: 'desktop',
  mobile: 'mobile',
};
const { locale } = useI18n();
const activeDevice = ref(DEVICES.destop);
const emit = defineEmits<{
  handleUndo: [];
  handleRedo: [];
  handleSwitchLayout: [mode: string];
  handlePlay: [];
  hanldeStoreChanges: [];
  handleRelease: [];
}>();
const handleSwitchLayout = (device: string) => {
  activeDevice.value = device;
  emit('handleSwitchLayout', 'desktop');
};
</script>

<style lang="scss" scoped>
.editor-layout {
  height: 64px;
  border-bottom: 1px solid $neutral-white-alpha-7;
  &__left {
    display: flex;
    align-items: center;
    cursor: pointer;
    &__back {
      margin-right: 16px;
    }
    &__text {
      margin-right: 8px;
    }
  }
  &__center {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 16px;
    cursor: pointer;
  }
  &__right {
    width: 100%;
    display: flex;
    justify-content: end;
    gap: 16px;
    & {
      .button {
        cursor: pointer;

        &__switcher {
          padding: 4px;
          display: flex;
          border-radius: 4px;
          border: 1px solid $neutral-white-alpha-7;
          background-color: $neutral-white-alpha-7;
          &span {
            width: 100%;
            height: 100%;
          }
          & .active {
            background-color: white !important;
            border-radius: 4px;
          }
        }
        &__play {
          cursor: pointer;
          border-radius: 4px;
          padding: 8px;
          border: 1px solid $neutral-white-alpha-7;
          background: $neutral-white-alpha-10;
        }
        &__text {
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          background: $neutral-white-alpha-90;
          color: #030c11;
        }
      }
    }
  }
}

.cursor-pointer {
  cursor: pointer;
}
:deep().navigation-item.leading {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
</style>
