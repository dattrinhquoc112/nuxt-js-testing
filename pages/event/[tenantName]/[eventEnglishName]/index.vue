<script lang="ts" setup>
import { useEventStore } from '~/stores/event';

// TODO: example for SEO

const route = useRoute();
const tenantName = route.params.tenantName as string;
const eventEnglishName = route.params.eventEnglishName as string;

useHead({
  title: `Dummy SEO for ${eventEnglishName}`,
  meta: [
    {
      name: 'description',
      content: `This is a dummy meta description for ${eventEnglishName} by ${tenantName}`,
    },
    { property: 'og:title', content: `Dummy SEO | ${eventEnglishName}` },
    {
      property: 'og:description',
      content: `Explore the dummy event page for ${eventEnglishName} by ${tenantName}`,
    },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' },
  ],
});

const { getPublishedContent } = useEventStore();
onMounted(() => {
  getPublishedContent(tenantName, eventEnglishName);
});
</script>
