<script setup lang="ts">
import { useHead, useAsyncData } from "#imports";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const { data } = await useAsyncData(
  "mock-seo",
  async () => {
    await delay(3000); // giả lập call API mất 3s

    return {
      metaTitle: "Mock Title after delay",
      metaDescription: "Mock Description after 3s",
      ogTitle: "OG Title Mock after delay",
      ogDescription: "OG Description Mock after delay",
      ogImageUri: "https://example.com/og-image.jpg",
      name: "Mock Site Name",
    };
  },
  {
    server: true,
  }
);

useHead({
  title: data.value.metaTitle || data.value.ogTitle,
  meta: [
    { name: "description", content: data.value.metaDescription },

    { property: "og:title", content: data.value.ogTitle },
    { property: "og:description", content: data.value.ogDescription },
    { property: "og:site_name", content: data.value.name },
    { property: "og:image", content: data.value.ogImageUri },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "vi_VN" },
    { property: "og:type", content: "website" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: data.value.ogTitle },
    { name: "twitter:description", content: data.value.ogDescription },
    { name: "twitter:image", content: data.value.ogImageUri },
  ],
});
</script>

<template>
  <div>Page loaded after 3s (check head tags)</div>
</template>
