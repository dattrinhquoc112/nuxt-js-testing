<template>
  <vi-modal
    :modal-title="$t('app-common-title-reached_limit')"
    :is-show="props.isShowModal"
    size="small"
    @close="handleClose"
  >
    <div class="container">
      <vi-typography type="body-small" class="description">
        {{ $t('app-common-description-reached_limit') }}</vi-typography
      >
    </div>
    <template #footer>
      <div class="flex">
        <vi-button
          type="primary-default"
          class="ml-auto mr-20"
          @click="handleConfirm"
          width="134px"
        >
          {{ $t('common-action-button-button_confirm') }}
        </vi-button>
      </div>
    </template>
  </vi-modal>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close']);
const props = defineProps({
  isShowModal: {
    type: Boolean,
    default: false,
  },
});

const handleClose = () => {
  emit('close');
};

const handleConfirm = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.container {
  .description {
    color: $neutral-white-alpha-100;
    margin: 24px 0;
  }
}
</style>
