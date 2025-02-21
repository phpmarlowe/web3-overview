<template>
  <div class="ga-table w-full">
    <el-table
      ref="elTableRef"
      show-overflow-tooltip
      :data="props.dataSource"
      class="w-full in"
      v-bind="tableConfig.childrenTree"
      @sort-change="changeSort"
      stripe
      row-key="id"
      :row-class-name="rowClassName"
      border
      @rowClick="rowClick"
    >
      <template v-for="item in props.tableConfig.propsList" :key="item.props">
        <el-table-column v-if="item.type === 'timer'" v-bind="item" :align="item.align ? item.align : 'center'">
          <template #default="scope">
            <!-- {{ formatUTC(scope.row[item.prop]) }} -->
          </template>
        </el-table-column>

        <el-table-column v-else-if="item.type === 'handler'" v-bind="item" :align="item.align ? item.align : 'center'">
          <template #default="scope">
            <el-button size="small" icon="Edit" type="primary" text @click="editBtnClick(scope.row)"> 编辑 </el-button>
            <el-button size="small" icon="Delete" type="danger" text @click="deleteBtnClick(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>

        <el-table-column v-else-if="item.type === 'custom'" v-bind="item" :align="item.align ? item.align : 'center'">
          <template #default="scope">
            <slot :name="item.slotName" v-bind="scope" :prop="item.prop"></slot>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          v-bind="item"
          :align="item.align ? item.align : 'center'"
          :formatter="
            item.formatter ? (row, column, cellValue) => item.formatter(cellValue, row, column) : item.formatter
          "
        >
          <template v-if="item.icon" v-slot:header="scoped">
            <span class="flex gap-5 justify-center items-center">
              {{ item.label }}
              <el-tooltip class="item" effect="light" :content="item.iconTip" placement="top-start">
                <el-icon style="color: white; font-size: smaller"><WarningFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页器 -->
    <div class="pagination" v-if="tableConfig.showPagenation">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        layout="prev, pager, next, jumper, ->, total, sizes"
        :total="props.pageTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue'
  import type { ElTable } from 'element-plus'
  import { Edit, WarningFilled } from '@element-plus/icons-vue'
  // 1.定义props
  interface IGaTable {
    dataSource: any[]
    tableConfig: any
    pageTotalCount?: number
    showRed: boolean // 当日统计需要
    showPointer: boolean
  }
  const props = defineProps<IGaTable>()

  // 2.定义事件
  const emit = defineEmits(['editClick', 'refreshList', 'rowClick'])

  // 3.表格 操作栏 相关方法
  let sort = ref('')
  function editBtnClick(info) {}
  function deleteBtnClick(id) {}

  // 4.分页器相关
  const currentPage = ref(1)
  const pageSize = ref(10)
  function handleSizeChange() {
    ///分页信息带出
    // emit('refreshList', { currentPage: currentPage.value, pageSize: pageSize.value })
  }
  function handleCurrentChange() {
    // /分页信息带出
    // emit('refreshList', { currentPage: currentPage.value, pageSize: pageSize.value })
  }
  function resetPaganation() {
    currentPage.value = 1
    pageSize.value = 10
    sort.value = ''
  }
  watch([currentPage, pageSize, sort], () => {
    emit('refreshList', { start: (currentPage.value - 1) * pageSize.value, limit: pageSize.value, sort: sort.value })
  })

  // 5.循环滚动相关
  const elTableRef = ref<InstanceType<typeof ElTable> | null>(null)
  let isScroll = true
  let isBottom = false
  onMounted(() => {
    if (!elTableRef.value || props.tableConfig.showPagenation) return
    const wrapper = elTableRef.value.$refs.bodyWrapper
    const dom1 = wrapper.getElementsByClassName('el-scrollbar__wrap')[0]

    dom1.addEventListener('mouseover', () => {
      isScroll = false
    })
    dom1.addEventListener('mouseout', () => {
      isScroll = true
    })
    setInterval(() => {
      if (!isScroll) return
      const dom2 = wrapper.getElementsByClassName('el-table__row')[0]
      if (!dom2) return

      if (dom1.scrollTop === 0) {
        isBottom = false
      }
      if (isBottom) {
        dom1.scrollTop -= Math.floor(dom1.scrollHeight / 2)
      } else {
        dom1.scrollTop += 1
      }
      if (dom1.clientHeight + dom1.scrollTop >= dom1.scrollHeight) {
        // dom1.scrollTop = dom1.scrollHeight / 2 - dom2.offsetHeight * 2
        // 是否要在这个时候发送网络请求？
        isBottom = true
      }
    }, 100)
  })

  //6.排序  p.s.结合公司原有方式,排序交由全局组件统一处理.若想完全控制可通过自定义事件抛出
  function changeSort(data: any) {
    const { order } = data
    const item = props.tableConfig.propsList.filter((elem) => {
      return elem.prop === data.prop
    })
    const name = item[0].sortName

    if (order === 'ascending') {
      sort.value = name + ' asc'
    } else if (order === 'descending') {
      sort.value = name + ' desc'
    } else {
      sort.value = ''
    }
    if (sort.value) {
      console.log('sort:', sort.value)
      sort.value = btoa(btoa(sort.value) + '==')
    }
  }

  //7.搜索  p.s.由于搜索按钮不在此 table 组件中但有需要用到此处状态
  function searchTableList() {
    emit('refreshList', { start: (currentPage.value - 1) * pageSize.value, limit: pageSize.value, sort: sort.value })
  }

  //8.单机、双击事件
  function rowClick(row, column, event) {
    emit('rowClick', row)
  }

  //9...
  function rowClassName(row) {
    // 现在只针对当日分析中 ga-table 处理样式：红色状态且改变鼠标样式
    const classList = []
    if (props.showPointer) {
      classList.push('el-table-pointer')
    }
    if (row.row && row.row.colerLevel && props.showRed && row.row.colerLevel == 1) {
      classList.push('row-red')
    }
    return classList
    // return params.row.colerLevel == 1 ? 'row-red' : ''
  }

  // 重置分页器,一般在 title 切换时使用
  defineExpose({
    resetPaganation,
    searchTableList,
  })
</script>

<style lang="scss">
  .pagination {
    margin-top: 20px;
  }
</style>
<style lang="scss">
  // ::v-deep(.el-table .el-table__cell) {
  //   padding: 0;
  //   height: 80px !important;
  //   line-height: 30px;
  // }

  .custom-th {
  }

  .el-table .row-red .cell {
    color: red !important;
  }
  .el-table-pointer {
    cursor: pointer;
  }
</style>
