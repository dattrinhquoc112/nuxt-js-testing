<template>
  <vi-modal
    :modal-title="$t('landing-common-modal-free_plan_limit_title')"
    :is-show="props.isShowModal"
    size="small"
    @close="emit('close')"
  >
    <div class="container">
      <vi-typography type="body-small" class="description">
        {{ $t('landing-common-modal-free_plan_limit_message') }}</vi-typography
      >
    </div>
    <template #footer>
      <div class="flex">
        <vi-button
          type="primary-default"
          class="ml-auto mr-20"
          @click="emit('close')"
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
</script>

<style lang="scss" scoped>
.container {
  .description {
    color: $neutral-white-alpha-100;
  }
}
</style>
