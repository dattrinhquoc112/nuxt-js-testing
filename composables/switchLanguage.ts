import { LANGUAGE_TYPE, type IUser } from '~/stores/interface/response/share';
import { useUserStore } from '~/stores/user';

export default function useSwitchLanguage() {
  const { locales, setLocale } = useI18n();
  const language = ref();
  const userDetail = ref<IUser>();
  const { updateUser } = useUserStore();

  const languageOptions = computed(() => {
    return locales.value.map((item: any) => ({
      text: item.name,
      value: item.code,
    }));
  });

  const setDefaultLanguage = (
    getLanguage = getCookie(KEY_LOCAL_STORAGE.I18N_LANGUAGE) || 'zh-TW'
  ) => {
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

  const init = async (initUser = userDetail.value) => {
    userDetail.value = initUser;
    let localLanguage = getCookie(KEY_LOCAL_STORAGE.I18N_LANGUAGE) || 'zh-TW';
    try {
      switch (userDetail?.value?.languageType) {
        case LANGUAGE_TYPE.ENGLISH:
          localLanguage = 'en-US';
          break;
        case LANGUAGE_TYPE.TRADITIONAL_CHINESE:
          localLanguage = 'zh-TW';
          break;
        default:
          break;
      }
    } catch (_) {}
    setDefaultLanguage(localLanguage);
  };

  const updateUserLanguage = async () => {
    let languageType = 'zh-TW';
    try {
      switch (language.value.value) {
        case 'en-US':
          languageType = LANGUAGE_TYPE.ENGLISH;
          break;
        case 'zh-TW':
          languageType = LANGUAGE_TYPE.TRADITIONAL_CHINESE;
          break;
        default:
          break;
      }
      if (languageType !== userDetail.value?.languageType) {
        await updateUser({
          languageType,
        });
      }
    } catch (_) {}
  };

  watch(language, async (_, oldValue) => {
    if (
      language.value.value &&
      oldValue &&
      language.value.value !== oldValue.value
    ) {
      await updateUserLanguage();
      setLocale(language.value.value);
      const domain = getOriginDomain(window.location.host);
      setCookie(KEY_LOCAL_STORAGE.I18N_LANGUAGE, language.value.value, {
        domain: domain !== 'localhost' ? `.${domain}` : undefined,
      });
      triggerChangeStorage();
    }
  });

  watch(userDetail, (value) => {
    if (value) {
      init();
    }
  });

  onMounted(() => {
    init();
  });
  return {
    languageOptions,
    language,
    init,
  };
}
