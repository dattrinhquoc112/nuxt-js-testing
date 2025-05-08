<template>
  <vi-form :model="model" :rules="rules" @submit="handleNextStep">
    <div class="form-wrap">
      <div class="wrap-name">
        <div class="first-name">
          <vi-form-item prop="firstName">
            <template #default="{ errorMsg }">
              <vi-input
                width="100%"
                type="text"
                :size="isUserProfile ? 'small' : 'large'"
                v-model="model.firstName"
                :label="$t('common-form-field-field_first_name')"
                :placeholder="
                  $t('common-form-placeholder-placeholder_first_name')
                "
                is-count
                :max="50"
                :error="Boolean(errorMsg)"
                :hint="errorMsg"
                @keydown="onKeyDown"
              />
            </template>
          </vi-form-item>
        </div>
        <div class="last-name">
          <vi-form-item prop="lastName">
            <template #default="{ errorMsg }">
              <vi-input
                width="100%"
                type="text"
                :size="isUserProfile ? 'small' : 'large'"
                v-model="model.lastName"
                :label="$t('common-form-field-field_last_name')"
                :placeholder="
                  $t('common-form-placeholder-placeholder_last_name')
                "
                is-count
                :max="50"
                :error="Boolean(errorMsg)"
                :hint="errorMsg"
                @keydown="onKeyDown"
              />
            </template>
          </vi-form-item>
        </div>
      </div>

      <div class="wrap-tel">
        <div class="first-tel">
          <vi-form-item prop="firstTel">
            <template #default="{ errorMsg }">
              <vi-dropdown
                v-model="model.firstTel"
                :size="isUserProfile ? 'small' : 'large'"
                :label="$t('common-form-field-field_country_code')"
                :listOption="listCountryCode"
                :message-error="errorMsg"
              />
            </template>
          </vi-form-item>
        </div>
        <div class="last-tel">
          <vi-form-item prop="lastTel">
            <template #default="{ errorMsg }">
              <vi-input
                width="100%"
                :size="isUserProfile ? 'small' : 'large'"
                type="number"
                v-model="model.lastTel"
                :label="$t('common-form-field-field_phone')"
                :placeholder="$t('common-form-placeholder-placeholder_phone')"
                :error="Boolean(errorMsg)"
                :hint="errorMsg"
                @keydown="onKeyDown"
              />
            </template>
          </vi-form-item>
        </div>
      </div>
      <slot name="btn-next">
        <vi-button width="100%">
          {{ $t('common-action-button-button_next') }}
        </vi-button>
      </slot>
    </div>
  </vi-form>
</template>

<script lang="ts" setup>
import type { INameAndTel } from '@/types/common';
import { type ICountryCodeResponse } from '~/stores/interface/response/share';
import { useOptionsStore } from '~/stores/options';

const { t } = useI18n();

defineProps({
  isUserProfile: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['next-step']);
const model = defineModel<INameAndTel>({
  default: {},
});

const listCountryCode = ref();
const { getMobileCountryCode } = useOptionsStore();

const rules = {
  firstName: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_first_name'),
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
  lastName: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_last_name'),
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
  firstTel: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_country_code'),
      }),
      trigger: 'change',
    },
  ],
  lastTel: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_phone'),
      }),
      trigger: 'change',
    },
    {
      regex: /^[0-9]+$/,
      message: t('error_fe-data-validation-input_format_invalid'),
      trigger: 'change',
    },
  ],
};

const handleNextStep = () => {
  // handle validate
  emit('next-step');
};

onMounted(async () => {
  const response: ICountryCodeResponse = await getMobileCountryCode();
  if (response.data.length) {
    listCountryCode.value = response.data.map((item) => {
      return {
        text: `+${item.id}`,
        value: item.id,
      };
    });
  }
});

const onKeyDown = (event: KeyboardEvent) => {
  if (/^[a-zA-Z0-9 ]$/.test(event.key)) return;
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ];
  if (allowedKeys.includes(event.key)) return;
  event.preventDefault();
};
</script>
<style lang="scss" scoped>
.form-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  .wrap-name {
    display: flex;
    gap: 16px;
    .first-name,
    .last-name {
      width: calc(50% - 8px);
    }
  }
  .wrap-tel {
    display: flex;
    gap: 16px;
    margin-bottom: 18px;
    .first-tel {
      width: 122px;
      :deep(.group-dropdown) {
        height: 100%;
      }
    }
    .last-tel {
      flex: 1;
    }
  }
}
</style>
