<template>
  <editor-section-render
    v-for="(section, index) in sections"
    :key="index"
    :section="section"
    is-public
  />
</template>

<script lang="ts" setup>
import { useEventStore } from '~/stores/event';

definePageMeta({
  layout: 'public',
});

// TODO: example for SEO

const route = useRoute();
const tenantName = route.params.tenantName as string;
const eventEnglishName = route.params.eventEnglishName as string;

const sections = ref();
const { getPublishedContent } = useEventStore();

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
  const data = await getPublishedContent(tenantName, eventEnglishName);
  if (!data.data.sections.length) return;
  sections.value = data.data.sections.map(
    (item: any) => item.settings.generalSettings
  );
  applySeoTags(data.data);
};

fetchContentPublic();
</script>
