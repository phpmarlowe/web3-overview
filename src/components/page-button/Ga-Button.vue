<script setup lang="ts">
  import { toRef } from 'vue'
  import search from '@/assets/img/home-view/search.svg'
  import exportIcon from '@/assets/img/home-view/download.svg'
  import close from '@/assets/img/home-view/close.svg'
  import { exportExcelApi } from '@/service/api/base'
  import { useTableInfoStore } from '@/stores/tableInfo'
  const $storeTableInfo = useTableInfoStore()

  // props
  const prop = defineProps({
    config: { type: Object, default: () => new Object() },
  })
  const emit = defineEmits(['search', 'close'])

  const buttons = toRef(prop.config.buttons)

  // 图标路径
  const buttonImg = {
    search,
    export: exportIcon,
    close,
  }

  function getClickFunction(item: any) {
    const { type } = item

    if (type === 'custom') {
      item.click && item.click()
    }
    if (type === 'search') {
      emit('search')
    }
    if (type === 'export') {
      exportFile(item.params)
    }
    if (type === 'close') {
      emit('close')
    }
  }

  // 按钮功能
  function exportFile(params = {}) {
    exportExcelApi(
      $storeTableInfo.currentTitle.exportUrl,
      {
        ...$storeTableInfo.formInfo,
        sort: $storeTableInfo.sort,
        headers: $storeTableInfo.tableHeader,
        type: $storeTableInfo.type,
        ...params,
      },
      $storeTableInfo.exportFileName,
    )
  }
</script>

<template>
  <div class="button-group">
    <template v-for="item in buttons" :key="item.type">
      <el-button type="text">
        <el-tooltip :content="item.tooltip" effect="light" placement="top">
          <img :src="buttonImg[item.type]" alt="" @click="getClickFunction(item)" />
        </el-tooltip>
      </el-button>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
