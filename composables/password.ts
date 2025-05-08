export default function usePassword() {
  const { t } = useI18n();
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
  return {
    listCondition,
  };
}
