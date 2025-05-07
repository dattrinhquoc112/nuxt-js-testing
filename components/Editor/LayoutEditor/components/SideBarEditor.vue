<template>
  <div class="sidebar-editor">
    <span class="active">
      <vi-button
        type="standard-subtle"
        icon-before="ic_section"
        no-text
        size="large"
      ></vi-button>
    </span>
    <span class="mt-4">
      <vi-button
        type="standard-subtle"
        icon-before="ic_ai_section"
        no-text
        size="large"
        class="p-12"
      ></vi-button>
    </span>

    <vi-button
      type="standard-subtle"
      icon-before="ic_capacity"
      no-text
      size="large"
      class="mt-auto p-12"
    ></vi-button>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.sidebar-editor {
  padding: 24px 4px;
  width: fit-content;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.07);
}
.active {
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.15);
}
.mt-auto {
  margin-top: auto;
}
.p-12 {
  padding: 12px;
}
.mt-4 {
  margin-top: 4px;
}
</style>
