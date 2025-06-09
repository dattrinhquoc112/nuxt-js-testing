<template>
  <vi-modal
    :modal-title="$t('landing-project_mgmt-modal-title_release_condition')"
    :is-show="model"
    @close="emit('update:model', false)"
    size="small"
  >
    <vi-typography type="body-small">
      {{ $t('landing-project_mgmt-modal-description_release_condition') }}
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
