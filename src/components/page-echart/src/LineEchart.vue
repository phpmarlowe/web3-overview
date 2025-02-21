<template>
  <div class="line-echart" style="height: 100%">
    <BaseEchart :option="option"></BaseEchart>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineProps, computed } from 'vue'
  import type { EChartsOption } from 'echarts'
  import BaseEchart from './BaseEchart.vue'

  // 自定义
  interface IProps {
    lineOption: {
      labels: string[]
      values: string[]
    }
  }
  const props = defineProps<IProps>()

  const option = computed<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: props.lineOption.labels,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '分类销量统计',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: props.lineOption.values,
        },
      ],
    }
  })
</script>

<style lang="scss" scoped></style>
