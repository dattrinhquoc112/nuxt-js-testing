export default function useFormValidation() {
  const form = reactive<{ [field: string]: boolean }>({});
  const errorField = (field: string, errMsg: string) => {
    form[field] = Boolean(errMsg);
    return Boolean(errMsg);
  };
  const isValidForm = computed(() => {
    return Object.values(form).every((hasError) => !hasError);
  });
  return {
    isValidForm,
    errorField,
  };
}
