<template>
  <div class="information-container">
    <div class="information-iitem mw-360">
      <img :src="imgSrc" />
      <vi-button class="br-1000" type="standard-default" width="fit-content"
        >未開始</vi-button
      >
      <vi-typography type="headline-xs">咪咪喵喵</vi-typography>
      <vi-typography class="description" type="body-small"
        >活動期間 2025/01/01-2025/12/31</vi-typography
      >
      <div class="child-item">
        <vi-typography class="description" type="body-small">
          https://campaign.dev.alice-ai.dev/eventpage/group/ccc
        </vi-typography>
        <vi-button
          class="browser-btn"
          type="standard-subtle"
          @click="
            openLink('https://campaign.dev.alice-ai.dev/eventpage/group/ccc')
          "
        >
          瀏覽網頁 <vi-icon name="ic_arrow_up_right" size="16" />
        </vi-button>
      </div>
      <vi-button type="standard-default" width="fit-content"
        >編輯資訊</vi-button
      >
    </div>
    <vi-divider direction="vertical" />
    <div class="information-iitem">
      <vi-typography>Meta</vi-typography>
      <div class="child-item">
        <vi-typography>咪咪喵喵</vi-typography>
        <vi-typography
          >網頁搜尋到的活動小簡介網頁搜尋到的活動小簡介網頁搜尋到的活動小簡介網頁搜尋到的活動小簡介網頁搜尋到的活動小簡介網頁搜</vi-typography
        >
        <vi-typography>活動, AI應用, 聲音小遊戲, 隨機, 偶像</vi-typography>
      </div>
      <vi-typography>OG</vi-typography>
      <div class="child-item fit">
        <img :src="imgSrc" />
        <vi-typography type="headline-xs">咪咪喵喵</vi-typography>
        <vi-typography class="description" type="body-small"
          >社群分享的介紹內容</vi-typography
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// TODO: dummy image
const imgSrc = new URL(
  '@/assets/images/demo/page_thumbnail.png',
  import.meta.url
).href;
</script>
<style lang="scss" scoped>
.button-action {
  display: flex;
  margin-left: auto;
  gap: 16px;
}
.fit {
  width: fit-content;
}
.mw-360 {
  max-width: 360px;
}
.br-1000 {
  border-radius: 1000px !important;
}
.description {
  color: $neutral-white-alpha-80 !important;
  word-break: break-all;
}
.browser-btn {
  margin-left: auto;
}
.information-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: stretch;
  .information-iitem {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: start;

    img {
      height: 200px;
      align-self: stretch;
      aspect-ratio: 9/5;
      border-radius: 4px;
      border: 0.5px solid $neutral-white-alpha-7;
    }

    .child-item {
      border-radius: 4px;
      border: 1px solid $neutral-white-alpha-10;
      display: flex;
      padding: 16px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 8px;
      align-self: stretch;

      img {
        height: 167px;
        align-self: stretch;
        border-radius: 4px;
      }
    }
  }
  :deep(.divider-wrap) {
    height: unset !important;
  }
}
.modal-footer {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
</style>
