import { useEventStore } from '~/stores/event';
import { MethodEnum } from '~/stores/interface/api';
import { getRequestHeaders, H3Event } from 'h3';

export default function useSeo() {
  const route = useRoute();
  const eventEnglishName = route.params.eventEnglishName as string;
  const { setSessionPublic, setTenantID, setIsPublish } = useEventStore();

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
    const event = useRequestEvent();
    const { data }: { data: any } = await useAsyncData(
      `landingWeb-${eventEnglishName}`,
      () =>
        $fetch('/client/api/landingWeb', {
          method: MethodEnum.POST,
          body: {
            method: MethodEnum.GET,
            endpoint: `/api/v1/projects/published-content`,
            params: {
              eventEnglishName,
            },
          },
          headers: {
            cookie: getRequestHeaders(event as H3Event).cookie || '',
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

    const { startTime, endTime, status } = data.value.data;
    const now = new Date();
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    const isWithinRange = now >= startTimeDate && now <= endTimeDate;
    if (status === 'STARTED' && isWithinRange) {
      setIsPublish(true);
    }
  };
  if (route.meta.layout === 'public' && eventEnglishName) {
    fetchContentPublic();
  }
}
