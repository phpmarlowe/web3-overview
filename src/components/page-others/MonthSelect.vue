<template>
  <el-select placeholder="月度" v-model="month" @change="changeFuncation" style="width: 0.84rem" clearable>
    <el-option
      v-for="item in monthArray"
      :key="item.key || ''"
      :value="item.key || ''"
      :label="item.name || ''"
    ></el-option>
  </el-select>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/stores/app'
  import { getDateCurrent } from '@/utils/tool'
  import { storeToRefs } from 'pinia'
  import { ref, defineEmits } from 'vue'
  const { isEchartEnlarge } = storeToRefs(useAppStore())
  const $emit = defineEmits(['changeMonth'])
  interface IProps {
    defaultMonth: number
  }
  // getDateCurrent('month').toString()
  const $props = defineProps<IProps>()
  // 自定义
  let month = ref($props.defaultMonth)
  // month.value = $props.defaultMonth
  const monthArray = ref([
    {
      name: '1月',
      key: '01',
    },
    {
      name: '2月',
      key: '02',
    },
    {
      name: '3月',
      key: '03',
    },
    {
      name: '4月',
      key: '04',
    },
    {
      name: '5月',
      key: '05',
    },
    {
      name: '6月',
      key: '06',
    },
    {
      name: '7月',
      key: '07',
    },
    {
      name: '8月',
      key: '08',
    },
    {
      name: '9月',
      key: '09',
    },
    {
      name: '10月',
      key: '10',
    },
    {
      name: '11月',
      key: '11',
    },
    {
      name: '12月',
      key: '12',
    },
  ])
  function changeFuncation() {
    $emit('changeMonth', month.value)
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.el-select__wrapper) {
    background-color: #0c1c4e;
    min-height: 29px;
    font-size: $font-sm;

    --el-border-color: #2d3960;
  }
  ::v-deep(.el-select-dropdown__item .is-selected) {
    color: #04cbf9 !important;
  }
  ::v-deep(.el-select__placeholder span) {
    font-size: $font-sm;
  }
</style>
