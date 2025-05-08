<template>
  <div class="app-container">
    <div class="header">
      <vi-typography type="subtitle-large">
        {{ $t('common-profile-button-button_account_setting') }}
      </vi-typography>
    </div>
    <div class="content">
      <div class="content-item">
        <vi-typography type="headline-s">
          {{ $t('common-section-title-section_personal_info') }}
        </vi-typography>
        <vi-form
          ref="formAvatarAndUserName"
          :model="userNameAndAvatar"
          :rules="UserNameAndAvatarRules"
        >
          <form-avatar v-model="userNameAndAvatar" />
          <vi-button
            @click="onSaveUserAvatar"
            :disabled="isDisabledSaveAvatar()"
            size="small"
          >
            {{ $t('common-action-button-button_save') }}
          </vi-button>
        </vi-form>
        <vi-typography class="mt-24" type="headline-s">
          {{ $t('common-section-title-section_account_info') }}
        </vi-typography>
        <vi-input
          v-model="userAccount.name"
          class="mt-12"
          :label="$t('common-form-field-field_account')"
          width="100%"
          disabled
        />
        <div class="mt-12">
          <form-name-and-tel
            :is-user-profile="true"
            v-model="infoNameAndTel"
            @next-step="onSaveUserNameAndTel"
          >
            <template #btn-next>
              <vi-button
                class="mt-12"
                size="small"
                :disabled="isDisabledSaveNameAndTel()"
              >
                {{ $t('common-action-button-button_save') }}
              </vi-button>
            </template>
          </form-name-and-tel>
        </div>
        <vi-typography class="mt-24" type="subtitle-large">
          {{ $t('common-form-field-field_password') }}
        </vi-typography>
        <vi-button
          v-if="password.isChange == false"
          class="mt-12"
          type="standard-default"
          size="small"
          @click="onChangePassword()"
        >
          {{ $t('common-action-button-button_change_password') }}
        </vi-button>
        <div v-if="password.isChange == true" class="mt-12 password-content">
          <vi-form :model="password" :rules="passwordRules">
            <div class="password-content">
              <vi-form-item prop="currentPassword">
                <template #default="{ errorMsg }">
                  <vi-input
                    type="password"
                    v-model="password.currentPassword"
                    required
                    width="100%"
                    :max="30"
                    :label="$t('common-form-field-field_current_password')"
                    :placeholder="
                      $t('common-form-placeholder-placeholder_current_password')
                    "
                    :error="Boolean(errorMsg) || Boolean(errorServer)"
                    :hint="errorMsg || errorServer"
                  />
                </template>
              </vi-form-item>
              <vi-form-item prop="value">
                <template #default="{ errorMsg }">
                  <vi-input
                    type="password"
                    v-model="password.value"
                    required
                    width="100%"
                    :max="30"
                    :label="$t('common-form-field-field_new_password')"
                    :placeholder="
                      $t('common-form-placeholder-placeholder_new_password')
                    "
                    :error="Boolean(errorMsg)"
                    :hint="errorMsg"
                  />
                </template>
              </vi-form-item>

              <vi-form-item prop="valueConfirm">
                <template #default="{ errorMsg }">
                  <vi-input
                    type="password"
                    v-model="password.valueConfirm"
                    required
                    width="100%"
                    :max="30"
                    :label="$t('common-form-field-field_confirm_new_password')"
                    :placeholder="
                      $t(
                        'common-form-placeholder-placeholder_confirm_new_password'
                      )
                    "
                    :error="Boolean(errorMsg) || Boolean(errorNotMatch)"
                    :hint="errorMsg || errorNotMatch"
                  />
                </template>
              </vi-form-item>
              <div class="box-condition">
                <vi-typography type="body-small">
                  {{ $t('common-form-title-title_password_requirements') }}
                </vi-typography>
                <ul>
                  <li
                    v-for="(item, index) in Object.values(listCondition)"
                    :key="index"
                    :class="{ active: item.passed }"
                  >
                    <vi-typography type="body-small">
                      {{ item.text }}</vi-typography
                    >
                  </li>
                </ul>
              </div>
              <div class="btn-group">
                <vi-button
                  type="standard-default"
                  @click="password.isChange = false"
                  size="small"
                >
                  {{ $t('common-action-button-button_cancel') }}
                </vi-button>
                <vi-button
                  :type="isDisabledSavePassword() ? 'standard-default' : ''"
                  @click="onSavePassword"
                  :disabled="isDisabledSavePassword()"
                  size="small"
                >
                  {{ $t('common-action-button-button_save') }}
                </vi-button>
              </div>
            </div>
          </vi-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import type { RequestUpdatePayload } from '@/stores/interface/request/shared';
import type { INameAndTel, IUserNameAndAvatar } from '@/types/common';
import type { IUser } from '@/stores/interface/response/share';
import usePassword from '@/composables/password';

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
});

const { t } = useI18n();

const defaultUser: Ref<IUser> = inject(PROVIDE.USER_INFO)!;
const { updateUser, uploadAvatar } = useAuthStore();

const { listCondition } = usePassword();
const errorNotMatch = ref();
const errorServer = ref<string>('');
const formAvatarAndUserName = ref();
const password = reactive({
  isChange: false,
  currentPassword: '',
  value: '',
  valueConfirm: '',
});

const UserNameAndAvatarRules = {
  userName: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_nickname'),
      }),
      trigger: 'change',
    },
    {
      regex: /^(?=.*[a-zA-Z])[a-zA-Z0-9](?:[a-zA-Z0-9 ]*[a-zA-Z0-9])?$/,
      message: t('error_fe-data-validation-input_format_invalid'),
      trigger: 'change',
    },
  ],
};

const passwordRules = {
  currentPassword: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_current_password'),
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
  value: [
    {
      required: true,
      message: t('error_fe-data-validation-field_required_empty', {
        field_name: t('common-form-field-field_new_password'),
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
        field_name: t('common-form-field-field_confirm_new_password'),
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

const userNameAndAvatar = reactive<IUserNameAndAvatar>({
  avatar: '',
  fileInput: null,
  userName: '',
});

const userAccount = reactive({
  id: '',
  name: '',
});

const infoNameAndTel = reactive<INameAndTel>({
  firstName: '',
  lastName: '',
  firstTel: { text: '', value: null },
  lastTel: '',
});

const isDisabledSaveAvatar = () => {
  const errorUserName = formAvatarAndUserName.value?.getErrors()?.userName;
  return (
    (userNameAndAvatar.avatar === defaultUser.value?.avatarUri &&
      userNameAndAvatar.userName === defaultUser.value.username) ||
    errorUserName
  );
};

const isDisabledSaveNameAndTel = () => {
  return (
    infoNameAndTel.firstName === defaultUser.value?.firstName &&
    infoNameAndTel.lastName === defaultUser.value?.lastName &&
    infoNameAndTel.firstTel.value === defaultUser.value?.mobileCountryCode &&
    infoNameAndTel.lastTel === defaultUser.value?.mobileNumber
  );
};

const getCurrentUser = async () => {
  if (!defaultUser.value) {
    return;
  }
  try {
    infoNameAndTel.firstName = defaultUser.value.firstName;
    infoNameAndTel.lastName = defaultUser.value.lastName;
    if (defaultUser.value.mobileCountryCode) {
      infoNameAndTel.firstTel.value = defaultUser.value.mobileCountryCode;
      infoNameAndTel.firstTel.text = `+${defaultUser.value.mobileCountryCode}`;
    }

    infoNameAndTel.lastTel = defaultUser.value.mobileNumber;
    userNameAndAvatar.avatar = defaultUser.value.avatarUri;
    userNameAndAvatar.userName = defaultUser.value.username;

    userAccount.name = defaultUser.value.email;
    userAccount.id = defaultUser.value.id;
  } catch (error) {}
};

const onSaveUserAvatar = async () => {
  let keyFile;

  if (userNameAndAvatar?.fileInput) {
    keyFile = await uploadAvatar(userNameAndAvatar.fileInput);
  }
  const payload: RequestUpdatePayload = {
    avatarFileKey: keyFile ?? undefined,
    username: userNameAndAvatar.userName,
  };
  const res = await updateUser(payload);
  defaultUser.value = {
    ...defaultUser.value,
    avatarUri: res.data.avatarUri,
    username: userNameAndAvatar.userName,
  };
  userNameAndAvatar.avatar = res.data.avatarUri;
  window.VIUIKit.VIMessage({
    title: t('notification-status-action-save_success'),
    width: '348px',
  });
};

const onSaveUserNameAndTel = async () => {
  const payload: RequestUpdatePayload = {
    firstName: infoNameAndTel.firstName ?? undefined,
    lastName: infoNameAndTel.lastName ?? undefined,
    mobileCountryCode: infoNameAndTel.firstTel.value ?? undefined,
    mobileNumber: infoNameAndTel.lastTel ?? undefined,
  };
  await updateUser(payload);
  defaultUser.value = {
    ...defaultUser.value,
    firstName: infoNameAndTel.firstName,
    lastName: infoNameAndTel.lastName,
    mobileCountryCode: infoNameAndTel.firstTel.value,
    mobileNumber: infoNameAndTel.lastTel,
  };
  window.VIUIKit.VIMessage({
    title: t('notification-status-action-save_success'),
    width: '348px',
  });
};

const handleValidate = () => {
  if (password.value !== password.valueConfirm) {
    errorNotMatch.value = t(
      'error_fe-auth-validation-password_confirm_mismatch'
    );
    return false;
  }
  errorNotMatch.value = '';
  return true;
};

const handleValidateAndConfirmPassword = () => {
  const isValid = Object.values(listCondition).every((c) => c.passed);
  const isPassValidate = handleValidate();
  return isValid && isPassValidate;
};

const isDisabledSavePassword = () => {
  return !(handleValidateAndConfirmPassword() && password.currentPassword);
};

const onChangePassword = () => {
  password.isChange = true;
  password.currentPassword = '';
  password.value = '';
  password.valueConfirm = '';
};

const onSavePassword = async () => {
  if (isDisabledSavePassword()) {
    return;
  }
  try {
    const payload: RequestUpdatePayload = {
      currentPassword: password.currentPassword,
      newPassword: password.value,
    };
    await updateUser(payload);
    password.isChange = false;
    window.VIUIKit.VIMessage({
      title: t('notification-status-action-update_password_success'),
      width: '348px',
    });
  } catch (error) {
    errorServer.value = getMessageErrorBackend(error, t);
  }
};

onMounted(() => {
  getCurrentUser();
});

watch(
  () => defaultUser?.value,
  () => {
    getCurrentUser();
  }
);
watch(
  () => password.value,
  () => {
    const count = countCharacters(password.value);
    listCondition.atLeast8Characters.passed = password.value.length >= 8;
    listCondition.mustHaveAtLeast1Number.passed = count.digits >= 1;
    listCondition.mustHaveAtLeast1LowercaseLetter.passed = count.lowercase >= 1;
    listCondition.mustHaveAtLeast1UppercaseLetter.passed = count.uppercase >= 1;
    listCondition.mustHaveAtLeast1SpecialSymbol.passed = count.special >= 1;
  }
);
watch(
  () => [password.value, password.valueConfirm],
  () => handleValidateAndConfirmPassword()
);
</script>
<style lang="scss" scoped>
.content-item {
  width: 50%;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  color: $neutral-white-alpha-100;
  button {
    width: fit-content;
    min-width: 0;
  }
  .form-wrap {
    gap: 32px;
  }
  .box-condition {
    padding: 12px;
    border-radius: 4px;
    ul {
      margin: 12px 0 0;
      padding-right: 0;
      padding-left: 20px;
      color: $neutral-white-alpha-60;
      li {
        &.active::marker {
          color: $brand-green-200-main;
        }
      }
      li + li {
        margin-top: 12px;
      }
    }
  }
  .btn-group {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
}

.password-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
