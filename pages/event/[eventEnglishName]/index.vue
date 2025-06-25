<template>
  <div>Test SEO</div>
</template>
<script setup>
useHead({
  title: 'Event english name',
  meta: [
    { name: 'description', content: 'Mô tả ngắn để hiển thị khi share link.' },

    // Open Graph
    { property: 'og:title', content: 'Tiêu đề OG' },
    { property: 'og:description', content: 'Mô tả OG' },
    { property: 'og:site_name', content: 'Tên website' },
    { property: 'og:image', content: 'https://vyin-landing-backend.sotatek.works/api/v1/general/media?fileKey=tenant/27/material/05d98293-1585-4dbc-90ec-1a9454d9f0f0.jpg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'vi_VN' },
    { property: 'og:type', content: 'website' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Tiêu đề OG' },
    { name: 'twitter:description', content: 'Mô tả OG' },
    { name: 'twitter:image', content: 'https://vyin-landing-backend.sotatek.works/api/v1/general/media?fileKey=tenant/27/material/05d98293-1585-4dbc-90ec-1a9454d9f0f0.jpg' },
  ]
})
</script>
