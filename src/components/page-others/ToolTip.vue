<template>
  <div class="h-full overflow-hidden" style="margin-top: 0.5px">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="props.text"
      :placement="props.placement || 'left'"
      hide-after="10"
      enterable="false"
    >
      <div
        class="box"
        style="font-size: 0.15rem"
        :style="{ maxWidth: props.maxWidth, width: props.width, fontSize: props.fontSize }"
        >{{ props.text }}</div
      >
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  // 自定义
  interface IProps {
    text: string | number
    maxWidth: string
    width: string
    fontSize: string
    placement: string
  }
  const props = defineProps<IProps>()
</script>

<style lang="scss" scoped>
  .box {
    word-break: keep-all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .box-number {
    font-size: 18px;
  }
</style>
