<template>
  <div :id="chartKey" class="w-full h-full" style="padding: 0; margin: 0"></div>
</template>

<script lang="ts" setup>
  import { pxToPx } from '@/utils'
  import { RingProgress } from '@antv/g2plot'
  import { nextTick, onMounted, ref, toRefs, watch } from 'vue'

  interface IProps {
    chartKey: string
    dataSource: object
  }
  const props = defineProps<IProps>()
  const { chartKey, dataSource } = toRefs(props)

  let ringProgress = ref(null)
  function initG2() {
    if (ringProgress.value || !chartKey.value) return
    ringProgress.value = new RingProgress(chartKey.value, {
      autoFit: true,
      percent: dataSource.value.rate,
      color: ['rgb(62, 206, 239)', '#3eceef'],
      statistic: {
        title: {
          style: {
            fontSize: '.14rem',
          },
          offsetY: pxToPx(20),
        },
        content: {
          style: {
            fontSize: '.14rem',
            color: '#fff',
          },
        },
      },
    })

    // ringProgress.value.destroy()
    ringProgress.value.render()
  }

  onMounted(() => {
    initG2()
    console.log(chartKey.value, 'chartKey')
  })
</script>

<style lang="scss" scoped></style>
