<template>
  <vi-modal
    :modal-title="$t('landing-project_mgmt-modal-title_edit_project_info')"
    :is-show="show"
    @close="emit('close')"
    size="small"
  >
    <vi-form :model="model" :rules="rules">
      <vi-form-item prop="name">
        <template #default="{ errorMsg }">
          <vi-input
            v-model="model.name"
            required
            :label="$t('landing-project_mgmt-modal-project_name')"
            :placeholder="
              $t('landing-project_mgmt-placeholder-placeholder_project_name')
            "
            width="100%"
            :error="Boolean(errorMsg)"
            :hint="errorMsg"
            is-count
            :max="50"
            @keydown="blockSpecialCharacters"
            :allowed-regex="/^[A-Za-z0-9 ]+$/"
          />
        </template>
      </vi-form-item>
    </vi-form>
    <template #footer>
      <div class="modal-footer">
        <vi-button
          type-button="button"
          @click="emit('edit', model.name)"
          type="standard-primary"
          width="fit-content"
          :disabled="!model.name || model.name === props.value"
          >{{ $t('common-action-button-button_confirm') }}</vi-button
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
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['close', 'edit']);
const { t } = useI18n();
const model = ref({
  name: '',
});
watch(
  () => props.value,
  (newValue) => {
    model.value.name = newValue;
  },
  { immediate: true }
);
const rules = {
  name: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('landing-project_mgmt-modal-project_name'),
      }),
      trigger: 'change',
    },
    {
      max: 50,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'blur',
    },
    {
      regex: /^[a-zA-Z0-9](?:[a-zA-Z0-9 ]*[a-zA-Z0-9])?$/,
      message: t('error_fe-data-validation-input_format_invalid'),
      trigger: 'change',
    },
  ],
};
</script>
<style lang="scss" scoped>
.modal-footer {
  display: flex;
  flex-direction: row-reverse;
  gap: 16px;
}
</style>
