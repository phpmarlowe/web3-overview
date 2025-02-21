<script>
  export default {
    name: 'HomeView',
  }
</script>

<script setup></script>

<template>
  <div class="home-view">
    <!-- 头部 -->
    <Header />

    <!-- 主体 -->

    <div class="body">
      <!-- 左侧 -->
      <div class="left"> </div>
      <!-- 中间 -->
      <div class="center"> </div>
      <!-- 右侧 -->
      <div class="right"> </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .home-view {
    width: 100vw;
    height: 100vh;
    color: #fff;
    background: url('@assets/img/home-view/bg.png') center/100% 100% no-repeat;
    overflow: hidden;
    .body {
      display: flex;
      // gap: 15px;
      box-sizing: content-box;
      padding: 0 15px;
      justify-content: space-between;
      position: relative;
      padding-top: 0.9vh;
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 2px;
        width: calc(50.5vh - 76px);
        height: 2px;
      }

      &::before {
        left: 15px;
        background: linear-gradient(-90deg, #3273e9 0%, #3273e9 98%, #ffffffaa 100%);
      }

      &::after {
        right: 15px;
        background: linear-gradient(90deg, #3273e9 0%, #3273e9 98%, #ffffffaa 100%);
      }

      .right {
        width: 470px;
      }

      .left {
        width: 470px;
      }

      .center {
        width: 920px;
      }
    }
  }
</style>
<style>
  .assets-card-box {
    background-color: pink;
  }
</style>
