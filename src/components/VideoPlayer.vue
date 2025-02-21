<script setup>
  import { ref, onMounted } from "vue";
  import { Close } from "@element-plus/icons-vue";
  import Player, { Events } from "xgplayer";
  import "xgplayer/dist/index.min.css";

  // prop
  const prop = defineProps({
    config: {
      type: Object,
      default: () => new Object(),
    },
  });

  // player
  const player = ref(null);

  // 挂载完成
  let playerInstance = null;
  onMounted(() => {
    playerInstance = new Player({
      el: player.value,
      url: prop.config.url,
    });
    // 视频加载完成
    playerInstance.on(Events.LOADED_DATA, () => {
      playerInstance.play();
    });
  });
</script>

<template>
  <div class="video-player">
    <div class="mask"></div>

    <div
      ref="player"
      class="player"
    ></div>

    <el-icon
      class="close-btn"
      size="24"
      @click="prop.config.handleClose"
    >
      <Close />
    </el-icon>
  </div>
</template>

<style scoped lang="scss">
  .video-player {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 30;

    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0.5;
      background: #000;
    }

    .player {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }

    .close-btn {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 44px;
      height: 44px;
      font-size: 24px;
      color: #fff;
      background-color: #606266;
      border-color: #fff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
</style>
