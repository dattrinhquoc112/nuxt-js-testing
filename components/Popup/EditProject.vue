<template>
  <vi-modal modal-title="編輯專案資訊" :is-show="show" @close="emit('close')">
    <vi-dropdown
      v-model="model.value"
      required
      label="專案名稱"
      :list-option="model.list"
    />
    <template #footer>
      <div class="modal-footer">
        <vi-button
          type-button="button"
          @click="emit('edit', model.value)"
          type="standard-primary"
          width="fit-content"
          :disabled="!model.value"
          >{{ $t('common-action-button-button_confirm.1') }}</vi-button
        >
        <vi-button
          type-button="button"
          @click="emit('close')"
          type="standard-default"
          width="fit-content"
          >{{ $t('common-action-button-button_cancel') }}</vi-button
        >
      </div>
    </template>
  </vi-modal>
</template>
<script lang="ts" setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close', 'edit']);
const model = reactive({
  value: undefined,
  list: [{ text: 'item 1', value: 'value 1' }],
});
</script>
<style lang="scss" scoped>
.modal-footer {
  display: flex;
  flex-direction: row-reverse;
  gap: 16px;
}
</style>
