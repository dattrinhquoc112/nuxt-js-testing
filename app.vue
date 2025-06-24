<template>
  <div>
    <!-- <NuxtRouteAnnouncer /> -->
    <!-- <NuxtWelcome /> -->
  </div>
</template>
<script setup>
useHead({
  title: 'Tiêu đề SEO của bạn',
  meta: [
    { name: 'description', content: 'Mô tả ngắn để hiển thị khi share link.' },

    // Open Graph
    { property: 'og:title', content: 'Tiêu đề OG' },
    { property: 'og:description', content: 'Mô tả OG' },
    { property: 'og:site_name', content: 'Tên website' },
    { property: 'og:image', content: 'https://fastly.picsum.photos/id/111/1200/630.jpg?hmac=PKIusysOSgX0l3rGBPJCcVzPsUm-YvaqJQaUs5hLW-A' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'vi_VN' },
    { property: 'og:type', content: 'website' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Tiêu đề OG' },
    { name: 'twitter:description', content: 'Mô tả OG' },
    { name: 'twitter:image', content: 'https://fastly.picsum.photos/id/111/1200/630.jpg?hmac=PKIusysOSgX0l3rGBPJCcVzPsUm-YvaqJQaUs5hLW-A' },
  ]
})
</script>
