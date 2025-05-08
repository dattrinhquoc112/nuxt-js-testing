<template>
  <vi-form
    :model="password"
    :rules="rules"
    @submit="handleValidateAndConfirmPassword"
  >
    <div class="password-container">
      <vi-form-item prop="value">
        <template #default="{ errorMsg }">
          <vi-input
            class="custom-input"
            type="password"
            v-model="password.value"
            required
            width="100%"
            :label="
              isResetPassword
                ? $t('common-form-field-field_new_password')
                : $t('common-form-field-field_password')
            "
            :placeholder="
              isResetPassword
                ? $t('common-form-placeholder-placeholder_new_password')
                : $t('common-form-placeholder-placeholder_password')
            "
            size="large"
            :error="Boolean(errorMsg) || Boolean(errorServer)"
            :hint="errorMsg || errorServer"
            :max="32"
          />
        </template>
      </vi-form-item>
      <vi-form-item prop="valueConfirm">
        <template #default="{ errorMsg }">
          <vi-input
            class="custom-input"
            type="password"
            v-model="password.valueConfirm"
            required
            width="100%"
            :label="
              isResetPassword
                ? $t('common-form-field-field_confirm_new_password')
                : $t('common-form-field-field_confirm_password')
            "
            :placeholder="
              isResetPassword
                ? $t('common-form-placeholder-placeholder_confirm_new_password')
                : $t('common-form-placeholder-placeholder_confirm_password')
            "
            size="large"
            :error="Boolean(errorMsg) || Boolean(errorNotMatch)"
            :hint="errorMsg || errorNotMatch"
            :max="32"
          />
        </template>
      </vi-form-item>
      <div class="box-condition">
        <vi-typography type="body-small">{{
          $t('common-form-title-title_password_requirements')
        }}</vi-typography>
        <ul>
          <li
            v-for="(item, index) in Object.values(listCondition)"
            :key="index"
            :class="{ active: item.passed }"
          >
            <vi-typography type="body-small"> {{ item.text }}</vi-typography>
          </li>
        </ul>
      </div>

      <div v-if="!isResetPassword" class="terms-privacy my-8">
        <vi-checkbox
          :label="$t('auth-signup-title-title_i_agree')"
          v-model="password.checked"
          :error="isNotChecked"
        />
        <vi-typography
          @click="handleOpenModalTerms"
          class="cursor-pointer"
          type="subtitle-small-underline"
        >
          {{ $t('auth-signup-button-button_policy') }}</vi-typography
        >
      </div>

      <vi-button :is-loading="isLoading" width="100%">
        {{
          isResetPassword
            ? $t('auth-account-action-button_save_password')
            : $t('common-action-button-button_signup')
        }}
      </vi-button>

      <popup-terms :is-show-modal="isShowModal" @close="handleCloseModalTerm" />
    </div>
  </vi-form>
</template>

<script lang="ts" setup>
import { countCharacters } from '@/utils/convert';
import type { IFormPassword } from '@/types/common';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  isResetPassword: {
    type: Boolean,
    default: false,
  },
  errorServer: {
    type: String,
    default: '',
  },
});
const { t } = useI18n();
const emit = defineEmits(['next-step']);
const isShowModal = ref(false);
const isNotChecked = ref(false);
const errorNotMatch = ref();
const password = defineModel<IFormPassword>({
  default: { value: '', valueConfirm: '', checked: false },
});

const rules = {
  value: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_password'),
      }),
      trigger: 'change',
    },
    {
      max: 32,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'change',
    },
    {
      min: 8,
      message: t('error_fe-data-validation-input_length_insufficient'),
      trigger: 'change',
    },
  ],
  valueConfirm: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_password'),
      }),
      trigger: 'change',
    },
    {
      max: 32,
      message: t('error_fe-data-validation-input_length_exceeded'),
      trigger: 'change',
    },
    {
      min: 8,
      message: t('error_fe-data-validation-input_length_insufficient'),
      trigger: 'change',
    },
  ],
};

const listCondition = reactive({
  atLeast8Characters: {
    passed: false,
    text: t('common-rule-password-rule_password_length'),
  },
  mustHaveAtLeast1Number: {
    passed: false,
    text: t('common-rule-password-rule_password_number'),
  },
  mustHaveAtLeast1LowercaseLetter: {
    passed: false,
    text: t('common-rule-password-rule_password_lowercase'),
  },
  mustHaveAtLeast1UppercaseLetter: {
    passed: false,
    text: t('common-rule-password-rule_password_uppercase'),
  },
  mustHaveAtLeast1SpecialSymbol: {
    passed: false,
    text: t('common-rule-password-rule_password_special_char', {
      at: ' (例如: !@#$%^&)',
    }),
  },
});
watch(
  password,
  () => {
    const count = countCharacters(password.value.value);
    listCondition.atLeast8Characters.passed = password.value.value.length >= 8;
    listCondition.mustHaveAtLeast1Number.passed = count.digits >= 1;
    listCondition.mustHaveAtLeast1LowercaseLetter.passed = count.lowercase >= 1;
    listCondition.mustHaveAtLeast1UppercaseLetter.passed = count.uppercase >= 1;
    listCondition.mustHaveAtLeast1SpecialSymbol.passed = count.special >= 1;
  },
  {
    deep: true,
  }
);
const handleCloseModalTerm = () => {
  isShowModal.value = false;
};

const handleOpenModalTerms = () => {
  isShowModal.value = true;
};

const handleValidate = async () => {
  if (password.value.value !== password.value.valueConfirm) {
    errorNotMatch.value = t(
      'error_fe-auth-validation-password_confirm_mismatch'
    );
    return false;
  }
  errorNotMatch.value = '';
  return true;
};

const handleValidateAndConfirmPassword = async () => {
  isNotChecked.value = !password.value.checked;
  const isValid = Object.values(listCondition).every((c) => c.passed);
  const isPassValidate = await handleValidate();
  if (
    isValid &&
    isPassValidate &&
    (password.value.checked || props.isResetPassword)
  ) {
    emit('next-step');
  }
};
</script>
<style lang="scss" scoped>
.password-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.box-condition {
  padding: 12px;
  border-radius: 4px;
  border: 1px solid $neutral-white-alpha-7;
  ul {
    margin: 12px 0 0;
    padding-right: 0;
    padding-left: 20px;
    li {
      color: $neutral-white-alpha-60;
      position: relative;
      list-style: none;
      &::before {
        content: '';
        position: absolute;
        left: -12px;
        top: 50%;
        width: 4px;
        height: 4px;
        background-color: $neutral-white-alpha-60;
        border-radius: 50%;
        transform: translateY(-50%);
      }
      &.active::before {
        background-color: $brand-green-200-main;
      }
      &.active {
        color: $neutral-white-alpha-100;
      }
    }
    li + li {
      margin-top: 12px;
    }
  }
}

.custom-input {
  :deep(.icon) {
    padding: 0px;
    svg {
      width: 24px;
      height: 24px;
    }
  }
}

.terms-privacy {
  display: flex;
  align-items: center;
  column-gap: 2px;
}
</style>
