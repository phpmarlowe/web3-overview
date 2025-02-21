<template>
  <el-date-picker
    v-model="year"
    type="year"
    placeholder="年份"
    style="width: 0.84rem; height: 0.29rem; border: 1px solid #29365e; padding-left: 10px; background-color: #0c1c4e"
    @change="changeFuncation"
    :empty-values="[new Date('2024')]"
  />
</template>

<script lang="ts" setup>
  import { useDateStore } from '@/stores/date'
  import { getDateCurrent } from '@/utils/tool'
  import dayjs from 'dayjs'
  import { ref, defineEmits } from 'vue'
  const $emit = defineEmits(['changeYear'])
  interface IProp {
    clearable: boolean
  }
  const $prop = defineProps<IProp>()
  const { getYearRange } = useDateStore()
  // 自定义
  let year = ref(getYearRange[0])
  function changeFuncation() {
    if (!year.value) {
      year.value = getYearRange[0]
    }
    $emit('changeYear', dayjs(year.value).format('YYYY'))
    // alert(dayjs(year.value).format('YYYY'))
  }
</script>

<style></style>
