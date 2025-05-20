<template>
  <div class="container">
    <div class="content-body">
      <slot />
    </div>
    <div class="header">
      <nuxt-link to="/">
        <img class="logo" src="assets/images/logo-platform.png" alt="logo" />
      </nuxt-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  height: 100vh;
  width: 100vw;
  background: rgba(3, 12, 17, 1) url('/assets/images/bg.png') no-repeat center
    center;
  color: #ffffff;
  .header {
    display: flex;
    height: 96px;
    width: fit-content;
    padding: 0px 40px;
    box-sizing: border-box;
    align-items: center;
    position: absolute;
    .logo {
      width: 80px;
    }
  }
  .content-body {
    display: flex;
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    overflow: auto;
  }
}
</style>
