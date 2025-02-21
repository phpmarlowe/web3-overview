<template>
  <div class="bar-echart" style="height: 100%">
    <Base-Echart :option="option"></Base-Echart>
  </div>
</template>

<script lang="ts" setup>
  import { computed, defineProps } from 'vue'
  import * as echarts from 'echarts'
  import type { EChartsOption } from 'echarts'

  import ChinaJSON from '../data/china.json'
  echarts.registerMap('china', ChinaJSON as any)
  import BaseEchart from './BaseEchart.vue'

  // 自定义'
  interface IProps {
    barOption: {
      labels: string[]
      values: string[]
    }
  }
  const props = defineProps<IProps>()

  const option = computed<EChartsOption>(() => {
    return {
      title: {
        text: '支持鼠标滚动缩放',
      },
      grid: {
        bottom: '5%',
      },
      xAxis: {
        data: props.barOption.labels,
        axisLabel: {
          inside: true,
          color: '#fff',
        },
        z: 10,
      },
      yAxis: {
        axisLabel: {
          color: '#999',
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      series: [
        {
          type: 'bar',
          showBackground: true,
          // 系列图形的样式(每个item的样式)
          // 可以被放到每一项中,针对每一项设置
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          // 图形的高亮: 鼠标悬浮时候的状态: hover
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' },
              ]),
            },
          },
          data: props.barOption.values,
        },
      ],
    }
  })
</script>

<style lang="scss" scoped></style>
