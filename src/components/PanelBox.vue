<script setup lang="ts">
  import { onMounted, ref, withDefaults } from 'vue'
  import { useAppStore } from '@/stores/app'
  import { cloneCanvas } from '@/utils'
  import PanelBox from './PanelBox.vue'
  import { storeToRefs } from 'pinia'
  import { useChartInfoStore } from '@/stores/chartInfo'
  const { setEchartSizeStatus } = useAppStore()

  const { isEchartEnlarge } = storeToRefs(useAppStore())
  const $chartInfoStore = useChartInfoStore()
  const { getCurrentEnlarge } = storeToRefs(useChartInfoStore())
  // props&emit
  interface IProps {
    showHeader: boolean // 是否展示头部
    title: string
    width: string | number
    height: string | number
    showEnlarge: boolean
    notCanvas: boolean
  }
  const props = withDefaults(defineProps<IProps>(), {
    showHeader: true, // 是否展示头部
    title: '',
    showEnlarge: true,
    notCanvas: false,
  })

  let { title, showHeader, showEnlarge, notCanvas } = props

  let bodyClass = ref('')
  // body 高度根据是否显示 header 部分动态变化
  let bodyHeight = ref('')
  if (!showHeader) {
    bodyHeight.value = 'body-height'
  } else {
    bodyHeight.value = ''
  }
  const isFullScreen = ref(false)
  let cloneBody = null
  const body = ref(null)
  let show = ref(false)
  const panelBox = ref(null)
  let cloneEle = ref('')

  const wrapper = ref(null)
  // 放大
  function enlarge() {
    bodyClass.value = 'fullscreen'
    show.value = true
    setEchartSizeStatus(show.value)
    $chartInfoStore.setCurrentEnlarge(props.title)
    // alert(getCurrentEnlarge.value)
    removeCloneBody()
    cloneBody = body.value.cloneNode(true)
    cloneBody.classList.remove('shrink')
    cloneBody.style.position = 'absolute'
    cloneBody.style.top = 'unset'
    cloneBody.style.bottom = 0
    cloneBody.style.left = 0
    cloneBody.style.right = 'unset'

    if (!notCanvas) {
      // 克隆canvas && 前提是弹出的是个 canvas 而不是图片
      cloneCanvas(cloneBody.querySelector('canvas'), body.value.querySelector('canvas'))
    }

    wrapper.value.appendChild(cloneBody)
    bodyClass.value = 'fullscreen'
  }

  // 缩小
  function shrink() {
    show.value = false
    bodyClass.value = 'shrink'
    $chartInfoStore.setCurrentEnlarge('')
    removeTimer = setTimeout(() => {
      body.value.style.overflow = 'visible'
      removeCloneBody()
      setEchartSizeStatus(show.value)
    }, 400)
  }
  // 移除克隆元素
  let removeTimer = null
  function removeCloneBody() {
    clearTimeout(removeTimer)
    if (cloneBody) {
      cloneBody.remove()
    }
  }

  onMounted(() => {
    // wrapper.value?.addEventListener('animationend', () => {
    //   setEchartSizeStatus(bodyClass.value === 'shrink' ? false : true)
    // })
  })

  // 抛出
  defineExpose({
    isFullScreen,
  })
</script>

<template>
  <div ref="wrapper" class="bg-[#12265b]" style="margin-bottom: 0.9vh; position: relative">
    <div ref="body" :class="[bodyClass]" class="panel-box w-full h-full">
      <div class="header flex gap-10 w-full items-center" v-show="showHeader">
        <div
          class="left flex items-center gap-2 pr-15"
          style="background: linear-gradient(0deg, #1b359a 0%, rgba(27, 55, 154, 0) 100%)"
          v-if="!show"
        >
          <img src="@/assets/img/home/arrow.png" class="w-25 h-25" alt="" srcset="" />
          <span class="font-lg font-bold"> {{ title }}</span>
        </div>

        <slot name="header" />
        <template v-if="showEnlarge && title != '物联网'">
          <img v-if="!show" class="enlarge" src="@/assets/img/home-view/quanping.svg" alt="" @click="enlarge()" />
          <img
            v-else
            class="enlarge"
            src="@/assets/img/home-view/guanbi.svg"
            alt=""
            @click="shrink()"
            style="height: 0.25rem"
          />
        </template>
      </div>
      <div :class="['body', bodyHeight]">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/styles/animation';

  .panel-box {
    position: relative;
    background-color: #12265b;
    &.x2 {
    }
    &.fullscreen {
      position: fixed;
      top: 10vh;
      left: 10vw;
      z-index: 1500;
      width: 80vw;
      height: 80vh;
      border-radius: 5px;
      background: #12265b;
      overflow: hidden;
      animation: enlarge 0.25s; //
      font-size: 20px;
      div,
      span,
      p {
        font-size: 30px; // 设置了em单位后放大倍数
      }

      .header {
        height: 40px;
        line-height: 40px;
        font-size: 15px !important; // 头部放大倍数
      }
      .close-btn {
        display: block;
        position: absolute;
        top: 15px;
        right: 15px;
        height: 30px;
        cursor: pointer;
      }
      ::v-deep(.x2) {
        font-size: 20px !important; // 设置了em单位后放大倍数
      }
      ::v-deep(.will-remove) {
        display: none; //有些玩意不需要的就移除
      }
      ::v-deep(.el-input__wrapper) {
        font-size: 1.5em;
      }
      ::v-deep(.my-header .el-select__wrapper) {
        height: 2em;
        font-size: 1.4em;
      }
      ::v-deep(.el-select) {
        z-index: 9999999999 !important;
      }
    }

    &.shrink {
      animation: shrink 0.25s;
    }

    .header {
      position: relative;
      height: 40px;
      line-height: 40px;
      font-size: 10px;
      font-weight: 600 !important;
      // margin-bottom: 10px;
      border-bottom: 2px solid rgb(40, 60, 97);
      // &::before {
      //   content: '';
      //   display: inline-block;
      //   margin: -2px 10px 0 9px;
      //   width: 12px;
      //   height: 12px;
      //   background-color: #fff;
      //   transform: rotate(45deg);
      //   vertical-align: middle;
      // }

      .enlarge {
        position: absolute;
        right: 10px;
        height: 20px;
        cursor: pointer;
      }
    }

    .body {
      height: calc(100% - 0.5rem);
      font-size: 10px;
      padding: 10px;
      padding-bottom: 0;
      overflow: hidden;
    }
    .body-height {
      height: 100%;
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      height: 20px;
      cursor: pointer;
    }
  }
</style>

<style lang="scss">
  // .fullscreen {
  //   div {
  //     font-size: 50px !important;
  //   }
  //   span {
  //     font-size: 60px !important;
  //   }
  //   .value {
  //     .unit {
  //       font-size: 45px !important;
  //     }
  //   }
  //   canvas {
  //     font-size: 33px !important;
  //   }
  //   .w-20 {
  //     width: 0.36rem;
  //   }
  //   .h-16 {
  //     height: 0.36rem;
  //   }
  //   /* 风险等级 */
  //   .w-75 {
  //     width: 1rem;
  //   }
  //   .h-30 {
  //     height: 0.3rem;
  //   }
  //   .w-25 {
  //     width: 30px;
  //   }
  //   .xxx {
  //     justify-content: center;
  //   }
  //   /* 质控管理、风险等级放大后剧中问题 */
  //   .ml-36 {
  //     margin-left: 2.1rem;
  //   }
  //   .ml-30 {
  //     margin-left: 2rem;
  //   }
  // }
</style>
