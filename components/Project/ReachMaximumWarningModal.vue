<template>
  <div class="modal-container">
    <vi-modal
      :modal-title="$t('app-common-title-reached_limit')"
      :is-show="isShowModal"
      size="small"
      @close="emit('close')"
    >
      <div class="container">
        <vi-typography type="body-large" class="description">
          {{ $t('app-common-description-reached_limit') }}</vi-typography
        >
      </div>
      <template #footer>
        <div class="flex">
          <vi-button
            type="primary-default"
            class="ml-auto"
            @click="emit('close')"
            width="65px"
          >
            {{ $t('common-action-button-button_confirm') }}
          </vi-button>
        </div>
      </template>
    </vi-modal>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close']);
defineProps({
  isShowModal: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.modal-container {
  :deep(svg) {
    opacity: 60%;
  }
  :deep(.modal .body .modal-header .modal-title) {
    font-size: 24px !important;
    line-height: 32px !important;
    letter-spacing: 0.25px;
  }
  :deep(.modal .body .modal-body .container .description) {
    font-size: 14px !important;
    font-weight: 400 !important;
    line-height: 20px !important;
    letter-spacing: 0.25px !important;
  }
  :deep(.modal .body .modal-footer-slot .flex button .typography) {
    font-size: 16px !important;
    font-weight: 500 !important;
    line-height: 24px !important;
    letter-spacing: 0.25px !important;
  }

  .container {
    :deep(.typography) {
      font-weight: 500 !important;
    }
    .description {
      color: $neutral-white-alpha-100;
      margin: 24px 0;
    }
  }
}
</style>
