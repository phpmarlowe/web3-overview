<template>
  <div :id="chartKey" class="w-full h-full bg-[#12499b]" style="padding: 0; margin: 0"></div>
</template>

<script lang="ts" setup>
  import { pxToPx } from '@/utils'
  import { Liquid } from '@antv/g2plot'
  import { nextTick, onMounted, ref, toRefs, watch } from 'vue'

  interface IProps {
    chartKey: string
    dataSource: object
  }
  const props = defineProps<IProps>()
  const { chartKey } = toRefs(props)

  let liquidPlot = ref(null)
  function initG2() {
    if (liquidPlot.value || !chartKey.value) return
    liquidPlot.value = new Liquid(chartKey.value, {
      percent: props.dataSource.rate,
      // appendPadding: 0,
      shape: 'rect',
      autoFit: true,
      // renderer: 'svg',
      radius: 2,
      color: 'l(270) 0.5:#2a5acf  1:#05adee',
      outline: {
        border: 1,
        distance: 0,
        style: {
          stroke: '#144999',
        },
      },
      shapeStyle: {
        fillOpacity: 0.5,
        stroke: 'red',
        lineWidth: 1,
        lineDash: [4, 5],
        strokeOpacity: 0.7,
        shadowColor: 'red',
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        cursor: 'pointer',
      },

      wave: {
        length: 60,
        count: 1, // 浪峰数量
      },
      statistic: {
        title: {
          content: props.dataSource.number,
          style: {
            fontSize: '.16rem',
            color: '#fff',
          },
          offsetY: pxToPx(20),
        },
        content: {
          offsetY: pxToPx(-48),
          style: { fontSize: '.16rem', color: 'white', opacity: 1 },
        },
      },
    })

    // liquidPlot.value.destroy()
    liquidPlot.value.render()
  }

  onMounted(() => {
    initG2()
    console.log(chartKey.value, 'chartKey')

    window.addEventListener('resize', () => {
      setTimeout(() => {
        // liquidPlot.value.changeSize(96, 110)
      }, 200)
    })
  })
</script>

<style lang="scss" scoped></style>
