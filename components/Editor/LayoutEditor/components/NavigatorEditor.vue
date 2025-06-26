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
          <div
            class="editor-layout__left"
            v-click-outside="() => (isOpenSettingEvent = false)"
          >
            <vi-typography
              type="headline-xs"
              class="editor-layout__left__text truncate cursor-pointer ellipsis"
              @click="isOpenSettingEvent = !isOpenSettingEvent"
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
                :disabled="!PERMISSION.isEditor"
                class="no-rounded min-w-148"
                width="fit-content"
                @click="
                  emit('handleEditInfo');
                  isOpenSettingEvent = false;
                "
              >
                <vi-typography type="body-large" class="cursor-pointer">
                  {{ $t('landing-project_mgmt-modal-title_edit_project_info') }}
                </vi-typography>
              </vi-button>
              <vi-button
                type="standard-default"
                class="no-rounded min-w-148"
                width="fit-content"
                @click="
                  emit('handleActivitySettings');
                  isOpenSettingEvent = false;
                "
              >
                <vi-typography type="body-large" class="cursor-pointer">
                  {{ $t('landing-project_mgmt-title-event_settings') }}
                </vi-typography>
              </vi-button>
            </div>
          </div>
        </div>
      </template>
      <template #second>
        <div class="editor-layout__center">
          <vi-button
            type="standard-subtle"
            icon-before="ic_step_back"
            no-text
            :disabled="
              !historyStatus?.undoButtonEnable ||
              rwdMode === RWD_MODE.MOBILE ||
              disableUndoRedo
            "
            @click="$emit('handleUndo')"
          ></vi-button>
          <vi-button
            type="standard-subtle"
            icon-before="ic_step_next"
            no-text
            :disabled="
              !historyStatus?.redoButtonEnable ||
              rwdMode === RWD_MODE.MOBILE ||
              disableUndoRedo
            "
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
              :class="{ active: rwdMode === RWD_MODE.DESKTOP }"
              :text-color="rwdMode === RWD_MODE.DESKTOP ? '#030C11' : '#fff'"
              @click="() => handleSwitchLayout(RWD_MODE.DESKTOP)"
            ></vi-button>

            <vi-button
              type="standard-subtle"
              icon-before="ic_device_mobile"
              no-text
              size="24"
              :class="{ active: rwdMode === RWD_MODE.MOBILE }"
              :text-color="rwdMode === RWD_MODE.MOBILE ? '#030C11' : '#fff'"
              @click="() => handleSwitchLayout(RWD_MODE.MOBILE)"
            ></vi-button>
          </div>
          <vi-button
            icon-before="ic_play"
            no-text
            color="#fff"
            type="standard-default"
            @click="$emit('handlePlay')"
          />
          <vi-button
            width="fit-content"
            :is-loading="loading.updateContent"
            type="standard-primary"
            @click="$emit('handleStoreChanges')"
            :disabled="!PERMISSION.isEditor"
          >
            <vi-typography type="subtitle-large" class="cursor-pointer">
              {{ $t('landing-editor-button-save_changes') }}
            </vi-typography>
          </vi-button>
          <vi-button
            width="fit-content"
            type="standard-primary"
            @click="$emit('handleRelease')"
            :is-loading="loading.publish"
            :disabled="!PERMISSION.isEditor"
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

import { RWD_MODE } from '~/constants/common';
import useCheckPermission from '~/composables/checkPermission';

const isOpenSettingEvent = ref(false);
defineProps<{
  historyStatus: any;
  projectName: string;
  rwdMode: string;
  disableUndoRedo: boolean;
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
const { PERMISSION } = useCheckPermission();

const handleSwitchLayout = (device: string) => {
  emit('handleSwitchLayout', device);
};

const navigateProjectList = () => {
  emit('handleBack');
};
</script>

<style lang="scss" scoped>
.editor-layout {
  height: 64px;
  border-bottom: 1px solid $neutral-white-alpha-7;
  background-image: url(@/assets/images/image-bg.svg);
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  z-index: 100;

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
      left: 0px;
      top: 40px;
      z-index: 40;
      display: flex;
      background-color: $brand-navy-800;
      border-radius: 4px;
      border: 0.5px solid $neutral-white-alpha-15;
      box-shadow: 0px 4px 8px 0px rgba(3, 12, 17, 0.8);
      flex-direction: column;
      text-align: left;
      white-space: nowrap;
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
:deep(.min-w-148) {
  .text-button {
    min-width: 148px;
    text-align: left;
  }
}
:deep(.navigation-item) {
  width: 33% !important;
}
</style>
