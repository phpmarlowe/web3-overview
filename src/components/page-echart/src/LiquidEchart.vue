<template>
  <BaseEchart :option="option"></BaseEchart>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import * as echarts from 'echarts'
  import type { EChartsOption } from 'echarts'
  import 'echarts-liquidfill'

  import BaseEchart from './BaseEchart.vue'

  // 自定义
  let option = ref({
    series: [
      {
        type: 'liquidFill',
        data: [0.5],
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#02B7F1', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#2158DD', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        ],
        phase: 1,
        radius: '50%',
        // center: ['100%', '100%'],
        waveLength: '100%',
        // itemStyle: {
        //   opacity: 0.6,
        // },
        emphasis: {
          itemStyle: {
            opacity: 1,
          },
        },
        shape: 'rect',
        zIndex: 999,
        outline: {
          show: true,
          borderDistance: 0,
          itemStyle: {
            borderColor: '#144999',
            borderWidth: 2,
            // shadowBlur: 20,
            // shadowColor: 'rgba(0, 0, 0, 0.25)',
          },
        },
        backgroundStyle: {
          color: '#12499b',
        },
        label: {
          formatter: '111',
          fontSize: 10,
          position: ['50%', '20%'],
          normal: {
            textStyle: {
              color: 'white', //改变标签颜色
              fontSize: 10,
            },
            insideColor: 'white', //改变水波内部字体颜色
          },
        },
      },
    ],
  })
</script>

<style lang="scss" scoped></style>
