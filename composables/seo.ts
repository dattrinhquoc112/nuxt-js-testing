import { useEventStore } from '~/stores/event';
import { MethodEnum } from '~/stores/interface/api';

export default function useSeo() {
  const route = useRoute();
  const tenantName = route.params.tenantName as string;
  const eventEnglishName = route.params.eventEnglishName as string;
  const { setSessionPublic, setTenantID } = useEventStore();

  function applySeoTags(seo: any) {
    const metaTags = [
      { name: 'description', content: seo.metaDescription || '' },
      { property: 'og:title', content: seo.ogTitle || '' },
      { property: 'og:description', content: seo.ogDescription || '' },
      { property: 'og:type', content: 'website' },
      { name: 'robots', content: 'index, follow' },
    ];

    if (seo.metaKeyword) {
      metaTags.push({ name: 'keywords', content: seo.metaKeyword });
    }

    if (seo.ogImageUri) {
      metaTags.push({ property: 'og:image', content: seo.ogImageUri });
    }

    useHead({
      title: seo.metaTitle || '',
      meta: metaTags,
    });
  }

  const fetchContentPublic = async () => {
    const { data }: { data: any } = await useAsyncData(
      `landingWeb-${tenantName}-${eventEnglishName}`,
      () =>
        $fetch('/client/api/landingWeb', {
          method: MethodEnum.POST,
          body: {
            method: MethodEnum.GET,
            endpoint: `/api/v1/projects/published-content?tenantName=${tenantName}&eventEnglishName=${eventEnglishName}`,
          },
        }),
      { server: true }
    );
    if (!data.value?.data?.sections?.length) return;
    const sectionsPublic = data.value.data.sections.map(
      (item: any) => item.settings.generalSettings
    );
    setSessionPublic(sectionsPublic);
    setTenantID(data.value.data.tenantId);
    applySeoTags(data.value.data);
  };
  if (route.meta.layout === 'public' && tenantName && eventEnglishName) {
    fetchContentPublic();
  }
}
