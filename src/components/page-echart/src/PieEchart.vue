<template>
  <div class="pie-echart" style="height: 100%">
    <BaseEchart :option="option"></BaseEchart>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineProps, computed } from 'vue'
  import type { EChartsOption } from 'echarts'

  import BaseEchart from './BaseEchart.vue'
  import type { IEchartValueType } from '../types/index'

  // 自定义
  interface IProps {
    pieData: IEchartValueType[]
  }
  const props = defineProps<IProps>()

  const option = computed<EChartsOption>(() => {
    return {
      // 手指放上去的时候显示的文本
      tooltip: {
        trigger: 'item',
      },
      // 图例:
      legend: {
        orient: 'horizontal',
        left: 'left',
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          bottom: '-10%',
          data: props.pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  })
</script>

<style lang="scss" scoped></style>
