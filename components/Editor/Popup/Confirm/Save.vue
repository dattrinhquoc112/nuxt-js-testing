<template>
  <vi-modal
    :modal-title="$t('landing-editor-modal-save_before_leave_title')"
    :is-show="isShow"
    @close="$emit('close')"
    size="small"
  >
    <vi-typography type="body-small">
      {{ $t('landing-editor-modal-save_before_leave_message') }}
    </vi-typography>
    <template #footer>
      <div class="editor-leave__footer">
        <vi-button
          type="standard-default"
          width="fit-content"
          @click="$emit('handle-leave')"
        >
          {{ $t('landing-editor-button-leave_without_saving') }}
        </vi-button>
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="$emit('handle-save-draft')"
        >
          {{ $t('landing-editor-button-save_progress') }}
        </vi-button>
      </div>
    </template>
  </vi-modal>
</template>

<script setup lang="ts">
defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['close', 'handle-save-draft', 'handle-leave']);
</script>

<style lang="scss" scoped></style>
