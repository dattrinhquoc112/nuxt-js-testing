<template>
  <vi-form :model="model" :rules="rules" @submit="emit('next-step')">
    <vi-typography class="mt-28" type="headline-s">{{
      $t('common-section-title-section_company_info')
    }}</vi-typography>

    <vi-form-item prop="companyName">
      <template #default="{ errorMsg }">
        <vi-input
          v-model="model.companyName"
          width="100%"
          class="mt-16"
          type="text"
          :label="$t('common-form-field-field_company_name')"
          :size="isSettingUser ? 'small' : 'large'"
          :placeholder="$t('common-form-placeholder-placeholder_company_name')"
          :error="Boolean(errorMsg)"
          :hint="errorMsg"
          is-count
          :max="50"
          @keydown="blockSpecialCharacters"
          required
        />
      </template>
    </vi-form-item>

    <vi-form-item prop="industry">
      <template #default="{ errorMsg }">
        <vi-dropdown
          v-model="model.industry"
          :label="$t('common-form-field-field_industry')"
          :placeholder="
            $t('common-form-placeholder-placeholder_company_industry')
          "
          required
          class="mt-16"
          :size="isSettingUser ? 'small' : 'large'"
          :list-option="companyIndustry"
          :message-error="errorMsg"
        />
      </template>
    </vi-form-item>

    <vi-form-item prop="size">
      <template #default="{ errorMsg }">
        <vi-dropdown
          v-model="model.size"
          :label="$t('common-form-field-field_company_size')"
          :placeholder="$t('common-form-placeholder-placeholder_company_size')"
          required
          class="mt-16"
          :size="isSettingUser ? 'small' : 'large'"
          :list-option="sizes"
          :message-error="errorMsg"
        />
      </template>
    </vi-form-item>

    <vi-form-item prop="country">
      <template #default="{ errorMsg }">
        <vi-dropdown
          v-model="model.country"
          :label="$t('common-form-field-field_country')"
          :placeholder="
            $t('common-form-placeholder-placeholder_company_country')
          "
          required
          class="mt-16"
          :list-option="countries"
          :message-error="errorMsg"
          :size="isSettingUser ? 'small' : 'large'"
        />
      </template>
    </vi-form-item>

    <slot name="btn-next">
      <vi-button width="100%" class="mt-16">{{
        $t('common-action-button-button_next')
      }}</vi-button>
    </slot>
  </vi-form>
</template>

<script setup lang="ts">
import useOptionCompanyTenant from '~/composables/optionCompanyTenant';
import { type ITenantInfo } from '~/types/common';

defineProps({
  isSettingUser: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();
const { countries, sizes, companyIndustry } = useOptionCompanyTenant();

const emit = defineEmits(['next-step']);

const model = defineModel<ITenantInfo>({
  default: {},
});

const rules = {
  companyName: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_company_name'),
      }),
      trigger: 'blur',
    },
    {
      max: 50,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'blur',
    },
    {
      regex: /^[a-zA-Z0-9](?:[a-zA-Z0-9 ]*[a-zA-Z0-9])?$/,
      message: t('error_fe-data-validation-input_format_invalid'),
      trigger: 'blur',
    },
  ],
  industry: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_industry'),
      }),
      trigger: 'blur',
    },
  ],
  size: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_company_size'),
      }),
      trigger: 'blur',
    },
  ],
  country: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_country'),
      }),
      trigger: 'blur',
    },
  ],
};
</script>

<style></style>
