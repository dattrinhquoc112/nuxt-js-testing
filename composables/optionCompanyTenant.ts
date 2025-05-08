import type { ICountryAllResponse } from '~/stores/interface/response/share';
import { useOptionsStore } from '~/stores/options';
import type { IItemOption } from '~/types/common';

export default function useOptionCompanyTenant() {
  const { t } = useI18n();
  const { getAllCountry } = useOptionsStore();
  const countries = ref<IItemOption[]>([]);
  const companyIndustry: IItemOption[] = [
    {
      text: t('platform-company-option-option_industry_tech'),
      value: 'INDUSTRY_TECH',
    },
    {
      text: t('platform-company-option-option_industry_finance'),
      value: 'INDUSTRY_FINANCE',
    },
    {
      text: t('platform-company-option-option_industry_manufacturing'),
      value: 'INDUSTRY_MANUFACTURING',
    },
    {
      text: t('platform-company-option-option_industry_services'),
      value: 'INDUSTRY_SERVICES',
    },
    {
      text: t('platform-company-option-option_industry_retail'),
      value: 'INDUSTRY_RETAIL',
    },
    {
      text: t('platform-company-option-option_industry_healthcare'),
      value: 'INDUSTRY_HEALTHCARE',
    },
    {
      text: t('platform-company-option-option_industry_education'),
      value: 'INDUSTRY_EDUCATION',
    },
    {
      text: t('platform-company-option-option_industry_others'),
      value: 'INDUSTRY_OTHERS',
    },
  ];
  const sizes = [
    {
      text: t('platform-company-option-option_size_1_10'),
      value: 'SIZE_1_10',
    },
    {
      text: t('platform-company-option-option_size_11_50'),
      value: 'SIZE_11_50',
    },
    {
      text: t('platform-company-option-option_size_51_100'),
      value: 'SIZE_51_100',
    },
    {
      text: t('platform-company-option-option_size_101_500'),
      value: 'SIZE_101_500',
    },
    {
      text: t('platform-company-option-option_size_500_1000'),
      value: 'SIZE_501_1000',
    },
    {
      text: t('platform-company-option-option_size_1001_plus'),
      value: 'SIZE_1001_PLUS',
    },
  ];
  onMounted(async () => {
    const res: ICountryAllResponse = await getAllCountry();
    countries.value = res.data.map((item) => ({
      text: item.id,
      value: item.id,
    }));
  });
  return { companyIndustry, sizes, countries };
}
