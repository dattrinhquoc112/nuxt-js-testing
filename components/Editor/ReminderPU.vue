<template>
  <vi-modal
    modal-title="未達發布條件"
    :is-show="model"
    @close="emit('update:model', false)"
    size="small"
  >
    <vi-typography type="body-small">
      專案尚未填寫活動設定，設定完成後才能發佈活動。
    </vi-typography>
    <template #footer>
      <div class="btn-confirm">
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="emit('handleClick')"
          class="ml-auto cursor-pointer"
        >
          <vi-typography type="subtitle-large" class="cursor-pointer">
            {{ $t('common-action-button-button_confirm') }}
          </vi-typography>
        </vi-button>
      </div>
    </template>
  </vi-modal>
</template>

<script setup lang="ts">
defineProps<{
  model: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:model', value: boolean): void;
  (e: 'handleClick'): void;
}>();
</script>
<style scoped lang="scss">
.btn-confirm {
  display: flex;
}
.ml-auto {
  margin-left: auto;
}
</style>
