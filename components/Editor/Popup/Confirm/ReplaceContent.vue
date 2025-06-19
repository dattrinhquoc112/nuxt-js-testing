<template>
  <vi-modal
    :modal-title="$t('landing-editor-modal-version_diff_title')"
    :is-show="isShow"
    @close="$emit('close')"
    size="small"
  >
    <vi-typography type="body-small">
      {{ $t('landing-editor-modal-version_diff_message') }}
    </vi-typography>
    <template #footer>
      <div class="editor-leave__footer">
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="$emit('handle-save-current')"
        >
          {{ $t('landing-editor-button-save_current_version') }}
        </vi-button>
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="$emit('handle-update-new')"
        >
          {{ $t('landing-editor-button-update_to_new_version') }}
        </vi-button>
      </div>
    </template>
  </vi-modal>
</template>

<script setup lang="ts">
defineProps({
  isShow: {
    type: Boolean,
    default: true,
  },
});
defineEmits(['close', 'handle-save-current', 'handle-update-new']);
</script>

<style lang="scss" scoped></style>
