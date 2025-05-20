<template>
  <div class="analysis-container">
    <div class="info">
      <vi-typography type="headline-xs">咪咪喵喵</vi-typography>
      <vi-typography class="description" type="body-small"
        >活動期間 2025/01/01-2025/12/31</vi-typography
      >
    </div>
    <div class="analysis-parts">
      <div v-for="(part, index) in parts" :key="index" class="part">
        <vi-typography class="description" type="body-small">{{
          part.title
        }}</vi-typography>
        <vi-typography type="headline-l">{{ part.value }}</vi-typography>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const parts = [
  {
    title: '總訪問人次',
    value: '200,291',
  },
  {
    title: '平均停留時間',
    value: '5 分 19 秒',
  },
  {
    title: '總 AI 工具使用數',
    value: '19,391',
  },
];
</script>
<style lang="scss" scoped>
.fit {
  width: fit-content;
}
.description {
  color: $neutral-white-alpha-80 !important;
  word-break: break-all;
}
.analysis-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  .info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .analysis-parts {
    display: flex;
    flex-direction: row;
    .part {
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
      min-width: 320px;
    }
  }
}
</style>
