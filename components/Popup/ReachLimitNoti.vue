<template>
  <vi-modal
    :modal-title="$t('landing-common-modal-free_plan_limit_title')"
    :is-show="modelValue"
    @close="$emit('update:modelValue', false)"
    size="small"
  >
    <vi-typography type="body-small" class="reach-limit--content">{{
      $t('landing-common-modal-free_plan_limit_message')
    }}</vi-typography>
    <template #footer>
      <div class="d-flex">
        <vi-button
          type-button="button"
          @click="$emit('update:modelValue', false)"
          type="standard-default"
          width="fit-content"
          class="reach-limit--button-confirm"
          >{{ $t('common-action-button-button_confirm') }}</vi-button
        >
      </div>
    </template>
  </vi-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import useMetric from '~/composables/metric';

const { checkReachLimit } = useMetric();
checkReachLimit();
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

defineEmits<{
  (e: 'update:modelValue', value: Boolean): void;
}>();
</script>

<style scoped lang="scss">
.reach-limit {
  &--content {
  }
  &--button-confirm {
    margin-left: auto;
  }
}
</style>
