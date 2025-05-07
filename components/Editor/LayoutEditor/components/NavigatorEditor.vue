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
          <vi-button
            type="standard-subtle"
            icon-before="ic_chevron_left"
            no-text
            size="24"
            width="fit-content"
            class="padding-0"
          ></vi-button>
          <vi-typography type="headline-xs" language-input="zh">
            未命名專案
          </vi-typography>
        </div>
      </template>
      <template #second>
        <div class="editor-layout__center">
          <vi-button
            type="standard-subtle"
            icon-before="ic_step_back"
            no-text
          ></vi-button>
          <vi-button
            type="standard-subtle"
            icon-before="ic_step_next"
            no-text
          ></vi-button>
        </div>
      </template>
      <template #third>
        <div class="editor-layout__right">
          <button class="button__switcher">
            <vi-button
              type="standard-subtle"
              icon-before="ic_device_desktop"
              no-text
              size="24"
            ></vi-button>
            <vi-button
              type="standard-subtle"
              icon-before="ic_device_mobile"
              no-text
              size="24"
            ></vi-button>
          </button>
          <vi-button icon-before="ic_play" no-text color="#fff" />
          <vi-button width="fit-content" type="standard-primary">
            儲存變更
          </vi-button>
          <vi-button width="fit-content" type="standard-primary">
            發布
          </vi-button>
        </div>
      </template>
    </vi-navigation-top>
  </div>
</template>
<script setup lang="ts"></script>

<style lang="scss" scoped>
.padding-0 {
  padding: 0;
}
.editor-layout {
  height: 64px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
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
          padding: 0px;
          display: flex;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background-color: rgba(255, 255, 255, 0.07);
        }
        &__play {
          cursor: pointer;
          border-radius: 4px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.1);
        }
        &__text {
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #030c11;
        }
      }
    }
  }
}
:deep().navigation-item.leading {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
</style>
