<script setup lang="ts">
  import { ref, toRefs, watch, onMounted } from 'vue'
  import { isParseNumber, pxToPx } from '@/utils'

  // props
  const prop = defineProps({
    config: { type: Object, default: () => new Object() },
  })
  const { columns, config = {}, data, maxHeight, sortChange } = toRefs(prop.config)
  // 表格
  const table = ref(null)

  // 监听数据变化
  watch(table, () => {
    table.value.doLayout()
  })

  // 默认排序
  let sortProps = {}
  const defaultSortOrders = ['descending', 'ascending', null]
  function defaultSortMethod(column, a, b) {
    const { prop, sortOrders = defaultSortOrders } = column
    const sortOrder = getSortOrder(prop, sortOrders)
    if (sortOrder === 'descending') {
      if (!isParseNumber(b[prop])) {
        return 1
      }
      if (!isParseNumber(a[prop])) {
        return -1
      }
    } else {
      if (!isParseNumber(a[prop])) {
        return 1
      }
      if (!isParseNumber(b[prop])) {
        return -1
      }
    }
    return a[prop] - b[prop]
  }

  // 获取排序
  let timer = null
  let getSortOrderFlag = false
  function getSortOrder(prop, sortOrders) {
    if (getSortOrderFlag) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      getSortOrderFlag = false
    }, 80)

    if (!getSortOrderFlag) {
      const index = sortOrders.indexOf(sortProps[prop] || null)
      sortProps = {}
      if (index > 0) {
        sortProps[prop] = sortOrders[0]
      } else {
        sortProps[prop] = sortOrders[index + 1]
      }
    }
    getSortOrderFlag = true
    return sortProps[prop]
  }

  // 挂载完成
  const tableWrapper = ref(null)
  onMounted(() => {
    // 滚动事件
    if (prop.config.scroll) {
      tableWrapper.value.querySelector('.el-scrollbar__wrap').addEventListener('scroll', prop.config.scroll)
    }
  })

  // 抛出
  defineExpose({
    table,
  })
</script>

<template>
  <!-- 列表 -->
  <div ref="tableWrapper" class="table-wrapper">
    <el-table
      ref="table"
      :data="data"
      :border="true"
      :max-height="maxHeight || pxToPx(500)"
      :row-key="config.rowKey"
      :tree-props="config.treeProps"
      :default-expand-all="config.defaultExpandAll"
      stripe
      style="width: 100%"
      @sort-change="sortChange"
    >
      <template
        v-for="(
          {
            prop,
            label,
            width,
            minWidth,
            className,
            formatter,
            sortable,
            sortOrders = defaultSortOrders,
            sortMethod = defaultSortMethod,
            align,
            children,
          },
          index
        ) in columns"
        :key="prop"
      >
        <el-table-column
          v-if="children"
          :prop="prop"
          :label="label"
          :width="width"
          :min-width="minWidth"
          :class-name="className"
          :formatter="formatter ? (row, column, cellValue) => formatter(cellValue, row, column) : formatter"
          :sortable="sortable"
          :sort-orders="sortOrders"
          :sort-method="sortMethod.bind(null, columns[index])"
          :align="align"
          :show-overflow-tooltip="true"
          :resizable="true"
        >
          <el-table-column
            v-for="(
              {
                prop,
                label,
                width,
                minWidth,
                className,
                formatter,
                sortable,
                sortOrders = defaultSortOrders,
                sortMethod = defaultSortMethod,
                align,
              },
              index
            ) in children"
            :key="prop"
            :prop="prop"
            :label="label"
            :width="width"
            :min-width="minWidth"
            :class-name="className"
            :formatter="formatter ? (row, column, cellValue) => formatter(cellValue, row, column) : formatter"
            :sortable="sortable"
            :sort-orders="sortOrders"
            :sort-method="sortMethod.bind(null, children[index])"
            :align="align"
            :show-overflow-tooltip="true"
            :resizable="true"
          />
        </el-table-column>
        <el-table-column
          v-else
          :prop="prop"
          :label="label"
          :width="width"
          :min-width="minWidth"
          :class-name="className"
          :formatter="formatter ? (row, column, cellValue) => formatter(cellValue, row, column) : formatter"
          :sortable="sortable"
          :sort-orders="sortOrders"
          :sort-method="sortMethod.bind(null, columns[index])"
          :align="align"
          :show-overflow-tooltip="true"
          :resizable="true"
        />
      </template>
    </el-table>
  </div>
</template>

<style scoped lang="scss"></style>
