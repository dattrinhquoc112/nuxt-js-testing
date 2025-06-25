import { useEventStore } from '~/stores/event';
import { MethodEnum } from '~/stores/interface/api';
import { getRequestHeaders, H3Event } from 'h3';

export default function useSeo() {
  const route = useRoute();
  const eventEnglishName = route.params.eventEnglishName as string;
  const { setSessionPublic, setTenantID, setIsPublish } = useEventStore();

  function htmlEncode(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function applySeoTags(seo: any) {
    const metaTags = [
      { name: 'description', content: seo.metaDescription || '' },
      { name: 'robots', content: 'index, follow' },

      { property: 'og:title', content: seo.ogTitle || seo.metaTitle || '' },
      {
        property: 'og:description',
        content: seo.ogDescription || seo.metaDescription || '',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: seo.name || '' },
      { property: 'og:url', content: window.location.href },
    ];

    if (seo.ogImageUri) {
      metaTags.push({
        property: 'og:image',
        content: getImage(seo.ogImageUri),
      });
    }

    metaTags.push(
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seo.ogTitle || seo.metaTitle || '' },
      {
        name: 'twitter:description',
        content: seo.ogDescription || seo.metaDescription || '',
      }
    );

    if (seo.ogImageUri) {
      metaTags.push({
        name: 'twitter:image',
        content: getImage(seo.ogImageUri),
      });
    }

    if (seo.metaKeyword) {
      metaTags.push({
        name: 'keywords',
        content: htmlEncode(seo.metaKeyword),
      });
    }

    useHead({
      title: seo.metaTitle || seo.ogTitle || '',
      meta: metaTags,
      link: [{ rel: 'canonical', href: window.location.href }],
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
