<template>
  <vi-form :model="model" :rules="rules" @submit="emit('next-step')">
    <vi-typography class="mt-28" type="headline-s">{{
      $t('auth-tenant_mgmt-title-title_set_your_team_name')
    }}</vi-typography>
    <vi-form-item prop="tenantName">
      <template #default="{ errorMsg }">
        <vi-input
          v-model="model.tenantName"
          width="100%"
          class="mt-16"
          type="text"
          :label="$t('common-form-field-field_team_name')"
          size="large"
          :placeholder="$t('common-form-field-field_team_name')"
          :error="Boolean(errorMsg)"
          :hint="errorMsg"
          required
          is-count
          :max="50"
          @keydown="blockSpecialCharacters"
        />
      </template>
    </vi-form-item>
    <vi-button width="100%" class="mt-16">{{
      $t('common-action-button-button_complete')
    }}</vi-button>
  </vi-form>
</template>

<script setup lang="ts">
import { blockSpecialCharacters } from '#imports';
import { type ITenantInfo } from '~/types/common';

const emit = defineEmits(['next-step']);

const { t } = useI18n();
const model = defineModel<ITenantInfo>({
  default: {},
});

const rules = {
  tenantName: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_team_name'),
      }),
      trigger: 'change',
    },
    {
      max: 50,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'change',
    },
    {
      regex: /^[a-zA-Z0-9](?:[a-zA-Z0-9 ]*[a-zA-Z0-9])?$/,
      message: t('error_fe-data-validation-input_format_invalid'),
      trigger: 'change',
    },
  ],
};
</script>

<style></style>
