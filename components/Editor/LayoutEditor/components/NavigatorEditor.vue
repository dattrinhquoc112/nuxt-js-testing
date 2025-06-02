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
            @click="navigateProjectList"
            name="ic_chevron_left"
            size="24"
            color="#fff"
            class="editor-layout__left__back"
          />
          <vi-typography
            type="headline-xs"
            class="editor-layout__left__text truncate"
          >
            {{ projectName }}
          </vi-typography>
          <vi-icon
            v-if="!isOpenSettingEvent"
            name="ic_chevron_down"
            size="16"
            color="#fff"
            class="editor-layout__left__dropdown"
            @click="isOpenSettingEvent = true"
          />
          <vi-icon
            v-if="isOpenSettingEvent"
            name="ic_chevron_up"
            size="16"
            color="#fff"
            class="editor-layout__left__dropdown"
            @click="isOpenSettingEvent = false"
          />
          <div
            v-if="isOpenSettingEvent"
            class="editor-layout__left__event-list"
          >
            <vi-button
              type="standard-default"
              class="no-rounded"
              @click="emit('handleEditInfo')"
            >
              <vi-typography type="body-large" class="cursor-pointer">
                {{ $t('landing-project_mgmt-modal-title_edit_project_info') }}
              </vi-typography>
            </vi-button>
            <vi-button
              type="standard-default"
              class="no-rounded"
              @click="emit('handleActivitySettings')"
            >
              <vi-typography type="body-large" class="cursor-pointer">
                {{ $t('landing-project_mgmt-title-event_settings') }}
              </vi-typography>
            </vi-button>
          </div>
        </div>
      </template>
      <template #second>
        <div class="editor-layout__center">
          <vi-button
            type="standard-subtle"
            icon-before="ic_step_back"
            no-text
            :disabled="!historyStatus?.undoButtonEnable"
            @click="$emit('handleUndo')"
          ></vi-button>
          <vi-button
            type="standard-subtle"
            icon-before="ic_step_next"
            no-text
            :disabled="!historyStatus?.redoButtonEnable"
            @click="$emit('handleRedo')"
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
            :is-loading="loading.updateContent"
            type="standard-primary"
            @click="$emit('handleStoreChanges')"
          >
            <vi-typography type="subtitle-large" class="cursor-pointer">
              {{ $t('landing-editor-button-save_changes') }}
            </vi-typography>
          </vi-button>
          <vi-button
            width="fit-content"
            type="standard-primary"
            @click="$emit('handleRelease')"
          >
            <vi-typography type="subtitle-large" class="cursor-pointer">
              {{ $t('landing-editor-button-publish') }}
            </vi-typography>
          </vi-button>
        </div>
      </template>
    </vi-navigation-top>
  </div>
</template>
<script setup lang="ts">
import { useEditorStore } from '~/stores/editor';

const DEVICES = {
  destop: 'desktop',
  mobile: 'mobile',
};
const activeDevice = ref(DEVICES.destop);

const isOpenSettingEvent = ref(false);
defineProps<{
  historyStatus: any;
  projectName: string;
}>();
const emit = defineEmits<{
  handleUndo: [];
  handleRedo: [];
  handleSwitchLayout: [mode: string];
  handlePlay: [];
  handleStoreChanges: [];
  handleRelease: [];
  handleBack: [];
  handleEditInfo: [];
  handleActivitySettings: [];
}>();
const { loading } = useEditorStore();

const handleSwitchLayout = (device: string) => {
  activeDevice.value = device;
  emit('handleSwitchLayout', 'desktop');
};

const navigateProjectList = () => {
  emit('handleBack');
};
</script>

<style lang="scss" scoped>
.editor-layout {
  height: 64px;
  border-bottom: 1px solid $neutral-white-alpha-7;

  &__left {
    display: flex;
    max-width: 100%;
    align-items: center;
    position: relative;
    cursor: pointer;
    &__back {
      margin-right: 16px;
    }
    &__text {
      flex: 1;
      margin-right: 8px;
    }
    &__event-list {
      position: absolute;
      left: 40px;
      top: 40px;
      z-index: 40;
      display: flex;
      width: 180px;
      background-color: $brand-navy-800;
      border-radius: 4px;
      border: 0.5px solid $neutral-white-alpha-15;
      box-shadow: 0px 4px 8px 0px rgba(3, 12, 17, 0.8);
      overflow: hidden;
      flex-direction: column;
      text-align: left;
      &--btn {
        margin-right: auto;
      }
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

:deep(.navigation-item.leading) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
:deep(.no-rounded.ui-kit-button) {
  justify-content: left;
  border-radius: 0 !important;
}
:deep(.navigation-item) {
  width: 33% !important;
}
</style>
