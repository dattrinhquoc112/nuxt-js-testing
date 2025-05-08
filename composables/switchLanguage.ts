export default function useSwitchLanguage() {
  const { locales, setLocale } = useI18n();
  const language = ref();

  const languageOptions = computed(() => {
    return locales.value.map((item: any) => ({
      text: item.name,
      value: item.code,
    }));
  });

  const setDefaultLanguage = () => {
    const getLanguage = getCookie(KEY_LOCAL_STORAGE.I18N_LANGUAGE) || 'zh-TW';
    const langCurrent = locales.value.find((item: any) => {
      return item.code === getLanguage;
    });
    if (langCurrent) {
      language.value = {
        text: langCurrent.name,
        value: langCurrent.code,
      };
    }
  };

  watch(language, (_, oldValue) => {
    if (language.value.value && oldValue) {
      setLocale(language.value.value);

      const domain = getOriginDomain(window.location.host);

      setCookie(KEY_LOCAL_STORAGE.I18N_LANGUAGE, language.value.value, {
        domain: domain !== 'localhost' ? `.${domain}` : undefined,
      });

      triggerChangeStorage();
    }
  });

  onMounted(() => {
    setDefaultLanguage();
  });
  return {
    languageOptions,
    language,
  };
}
