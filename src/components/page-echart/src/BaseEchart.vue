<template>
  <div class="base-echart w-full h-full">
    <div
      class="echart w-full h-full"
      ref="echartRef"
      :style="{ height: props.height, width: props.width, backgroundColor: props.bgColor }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watchEffect, watch, defineProps, nextTick, computed, defineEmits, toRaw } from 'vue'
  import * as echarts from 'echarts'
  import type { EChartsOption } from 'echarts'
  import { useAppStore } from '@/stores/app'
  import { storeToRefs } from 'pinia'
  import { useChartInfoStore } from '@/stores/chartInfo'
  import { formatNumber, pxToPx } from '@/utils'

  // props
  interface IProps {
    option: EChartsOption
    dataSource: any
    height?: number | string
    width?: number | string
    bgColor?: string
  }
  const props = defineProps<IProps>()

  const emit = defineEmits(['chartClick'])

  // store
  const { isEchartEnlarge } = storeToRefs(useAppStore())
  const { getCurrentEnlarge, setChartOption, $chartInfo } = useChartInfoStore()
  const echartRef = ref<HTMLElement>()

  // 节流函数
  function throttle(fn, wait) {
    let timeout = null
    return function () {
      let context = this
      let args = arguments
      if (!timeout) {
        timeout = setTimeout(() => {
          fn.apply(context, args)
          timeout = null
        }, wait)
      }
    }
  }

  let timer = ref('')

  // 专门用来处理样式
  function deepReset(obj: any) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // 如果属性值是对象，递归重置
          deepReset(obj[key])
        } else {
          if (Array.isArray(obj[key])) {
            obj[key] = []
          } else if (typeof obj[key] == 'function' && obj[key].name === 'getPx') {
            // console.log(key, 'key------', key)
            if (!obj['test']) {
              obj['test'] = JSON.parse(JSON.stringify(obj))
            }
            obj[key] = obj[key]()
          } else {
            // 不做处理
          }
        }
      }
    }
    return obj
  }
  onMounted(() => {
    console.log(props.option, '第一次加载的option')
    // optionsss = { ...props.option }
    // 0. 全局管理 echart 图表
    // 1.初始化ecarts
    const echartInstance = echarts.init(echartRef.value!, 'light', { renderer: 'canvas' })
    setChartOption(echartInstance, echartInstance.getWidth())
    // 2.监听传入的 options 改变 重新执行
    watchEffect(() => {
      if (props.dataSource && Array.isArray(props.option.series) && props.option.series.length > 1) {
        props.option.series.map((elem, index) => {
          elem.data = props.dataSource[index]
        })
      } else if (props.dataSource && !Array.isArray(props.option.series)) {
        props.option.series!.data = props.dataSource
      } else if (props.dataSource && Array.isArray(props.option.series) && props.option.series.length === 1) {
        props.option.series[0].data = props.dataSource
      }

      // if (
      //   echartList.findIndex((elem) => {
      //     return elem.chartName === props.option.chartName
      //   })
      // )
      // let a = deepReset(props.option)
      console.log(props.option, '重新setoption')

      return echartInstance.setOption(props.option)
    })
    watch(
      props.dataSource,
      (newValue, oldValue) => {
        echartInstance.setOption(props.option)
      },
      { immediate: false, deep: true },
    )
    //3. 监听 window 缩放
    window.addEventListener('resize', () => {
      setTimeout(() => {
        echartInstance.resize()
        console.log('base-echart 重新渲染')
      }, 300)
    })
    // 4.监听图表放大缩小
    watch(isEchartEnlarge, (newValue, oldValue) => {
      // console.log(props.option, 'oop')
      // console.log(deepReset(props.option), 'oopp')
      // echartInstance.setOption(deepReset(props.option))
      echartInstance.resize()
    })

    echartInstance.on('click', function (params) {
      emit('chartClick', params)
    })
  })
</script>

<style lang="scss" scoped></style>
