<template>
  <vi-modal
    :modal-title="$t('landing-project_mgmt-modal-title_edit_project_info')"
    :is-show="show"
    @close="emit('close')"
    size="small"
    :close-on-click-modal="false"
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
            :error="errorField('name', errorMsg)"
            :hint="errorMsg"
            is-count
            :max="50"
            :allowed-regex="/^[\p{L}\p{N} _-]*$/u"
            size="large"
            :disabled="!PERMISSION.isEditor"
            @blur="onBlur"
          />
        </template>
      </vi-form-item>
    </vi-form>
    <template #footer>
      <div class="modal-footer">
        <vi-button
          type-button="button"
          @click="onSubmit"
          type="standard-primary"
          width="fit-content"
          :disabled="isDisabled()"
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
import useCheckPermission from '~/composables/checkPermission';
import useFormValidation from '~/composables/formValidation';

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
const model = reactive({
  name: '',
});

const { PERMISSION } = useCheckPermission();
const { isValidForm, errorField } = useFormValidation();

const isDisabled = () => {
  return (
    !model.name ||
    model.name === props.value ||
    !PERMISSION.value.isEditor ||
    !isValidForm.value
  );
};
const onSubmit = () => {
  if (isDisabled()) return;
  emit('edit', model.name);
};

const onBlur = () => {
  model.name = model.name.trim();
};
watch(
  () => props.value,
  (newValue) => {
    model.name = newValue;
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
      regex: /^[\p{L}\p{N} _-]*$/u,
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
