<!-- 业务类型-报表-列表 -->
<template>
  <!-- 头部 -->
  <header class="mb-20">
    <!-- 标题 -->
    <DialogTitle :title-config="titleConfig" @change-title="changeTitle" />
    <!-- 按钮 -->
    <Ga-Button @search="getTableList(getQueryInfo)" @search="getTableList" @close="handleClose" />
  </header>

  <Ga-Form :config="formConfig" ref="dialogForm"></Ga-Form>
  <Ga-Table :table-config="tableConfig" :data-source="tableList" ref="gaTableRef" @refreshList="getTableList">
    <!-- <template #assetsName="scope">
        <span class="assetsName">{{ scope.row[scope.prop] }} ({{ scope.row['assetsNo'] }})</span>
      </template> -->
  </Ga-Table>
</template>

<script lang="ts" setup>
  import type { IGaForm, IGaTitle } from '@/type/Gable'
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { deploymentFConfig } from './config/form.config'
  import { deploymentTConfig } from './config/table.config'
  import { typeCardInfoMoreApi } from '@/service/api/home/card'
  import { useTableInfoStore } from '@/stores/tableInfo'
  import { storeToRefs } from 'pinia'
  const $store = useTableInfoStore()
  const { getQueryInfo } = storeToRefs($store)
  //0.0 API
  interface IProps {
    params: () => {}
  }
  const $props = defineProps<IProps>()
  const $emit = defineEmits(['closeDialog'])
  const $tableInfoStore = useTableInfoStore()

  //1.0 标题
  const titleConfig: IGaTitle[] = computed(() => {
    return [
      {
        name: '业务类型统计',
        tableConf: deploymentTConfig,
        formConf: deploymentFConfig.value,
        exportUrl: 'assets/queryDeploymentTypeCardInfoMoreForExport',
      },
    ]
  })
  /// 1.1
  let currentClick = ref(0)
  function changeTitle(index: number) {
    getTableList()
    currentClick.value = index
  }

  //2.0 按钮
  const buttonConfig = computed(() => {
    return {
      buttons: [
        {
          type: 'search',
          tooltip: '查询',
        },
        {
          type: 'export',
          tooltip: '导出',
        },
        { type: 'close', tooltip: '关闭' },
      ],
    }
  })
  /// 2.1
  function handleClose() {
    $emit('closeDialog')
  }

  //3.0 表单
  const dialogForm = ref(null)
  let isReload = ref(false)
  const formConfig: IGaForm = ref({
    columns: [],
    params: $props.params,
  })

  //4.0 表格
  let tableList = ref([])
  let tableConfig = computed(() => {
    return deploymentTConfig
  })
  ///4.1
  async function getTableList(paginationInfo = { start: 0, limit: 10, sort: '' }) {
    let formData = dialogForm.value.formData
    if (isReload.value) {
      formData = dialogForm.value.getFormData()
    }
    // 全局记录下当前的弹窗信息 start
    $tableInfoStore.initTableInfo(tableConfig.value.propsList, titleConfig.value[currentClick.value], formData, {
      ...$props.params,
      ...paginationInfo,
    })
    // 全局记录下当前的弹窗信息 end

    const {
      data: { mainBusinessTypeList = [] },
    } = await typeCardInfoMoreApi({
      ...paginationInfo,
      ...$props.params,
      ...formData,
    })

    tableList.value = mainBusinessTypeList
    isReload.value = true
    ////此处记录下相关信息
  }

  //0.0 初始化
  onMounted(() => {
    formConfig.value.columns = deploymentFConfig.value
    nextTick(() => {
      changeTitle(0)
    })
  })
</script>

<style lang="scss" scoped></style>
