<template>
  <div class="event-page">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <img :src="ogImage" alt="OG Image" />
  </div>
</template>

<script setup>
const title = 'title';
const description = 'description';
const ogTitle = 'title og';
const ogDescription = 'description og';
const ogImage = getImage(
  'gs://dev-landing-external-bucket/tenant/1/material/66b58a47-6578-429f-ac89-22316e13198f.png'
);
console.log(ogImage);
const ogUrl = window.location.href;

useHead({
  title,
  meta: [
    { name: 'description', content: description },

    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: ogDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: ogUrl },
    { property: 'og:type', content: 'website' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: ogTitle },
    { name: 'twitter:description', content: ogDescription },
    { name: 'twitter:image', content: ogImage },
  ],
});
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
