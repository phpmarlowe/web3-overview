<script setup>
  import { ref, toRefs, watch } from 'vue'
  import dayjs from 'dayjs'
  import { pxToPx } from '@/utils'
  import SelectOption from '@/components/SelectOption.vue'
  import AssetsCategory from '@/components/AssetsCategory.vue'

  // props
  const prop = defineProps({
    config: { type: Object, default: () => new Object() },
  })
  const { columns, params } = toRefs(prop.config)
  console.log(params.value, 'formParmas')

  // 查询条件绑定数据
  const searchData = ref({})

  // 提交表单数据
  const formData = ref({})

  // 初始化searchForm
  function setSearchForm() {
    console.log('setForm', params.value)
    let obj = {}
    columns.value.forEach(({ key, value = null, key2, value2 = null, type, append = [] }) => {
      if (type === 'monthrange' || type === 'daterange') {
        obj[key + '-' + key2] = [value, value2]
        obj[key] = value
        obj[key2] = value2
      } else if (type === 'multipleselect' || type === 'category') {
        obj[key] = value ? value : []
      } else {
        obj[key] = value
      }
      append.forEach(({ key: appendKey, value: appendValue = null }) => {
        if (appendKey) {
          obj[appendKey] = appendValue
        }
      })
    })
    searchData.value = { ...obj, ...params.value }
    formData.value = { ...obj, ...params.value }
    console.log('----------------------')
    console.log(searchData, 'searchData')
  }

  // 获取参数
  function getFormData() {
    columns.value.forEach(({ key, key2, type, formatter, append = [] }) => {
      if (formatter) {
        formData.value[key] = formatter(searchData.value[key], key, searchData.value, formData.value)
      }
      // 月份范围
      else if (type === 'monthrange') {
        const value = searchData.value[key + '-' + key2] || []
        formData.value[key] = value[0] ? dayjs(value[0]).format('YYYY-MM') : null
        formData.value[key2] = value[1] ? dayjs(value[1]).format('YYYY-MM') : null
      }
      // 日期范围
      else if (type === 'daterange') {
        const value = searchData.value[key + '-' + key2] || []
        formData.value[key] = value[0] ? dayjs(value[0]).format('YYYY-MM-DD') : null
        formData.value[key2] = value[1] ? dayjs(value[1]).format('YYYY-MM-DD') : null
      }
      // 多选下拉框 || 资产分类
      else if (type === 'multipleselect' || type === 'category') {
        const value = searchData.value[key]
        formData.value[key] = value ? value.join(',') : null
      }
      // 日期
      else if (type === 'date') {
        const value = searchData.value[key]
        formData.value[key] = value ? dayjs(value).format('YYYY-MM-DD') : null
      }
      // 其他
      else {
        formData.value[key] = searchData.value[key]
      }

      append.forEach(({ key: appendKey, formatter: appendFormatter }) => {
        if (!appendKey) {
          return
        }
        if (appendFormatter) {
          formData.value[appendKey] = appendFormatter(
            searchData.value[appendKey],
            key,
            searchData.value,
            formData.value,
          )
        } else {
          formData.value[appendKey] = searchData.value[appendKey]
        }
      })
    })
    return formData.value
  }

  // 重新设置form表单
  watch(columns, () => {
    setSearchForm()
    getFormData()
  })

  // 抛出数据
  defineExpose({
    searchData,
    formData,
    getFormData,
  })
</script>

<template>
  <!-- 表单 -->
  <el-form v-model="searchData" inline>
    <template
      v-for="(
        {
          name,
          key,
          name2,
          key2,
          type,
          clearable = true,
          filterable = true,
          options,
          optionKey,
          optionLabel,
          append,
          onChange,
          width,
          childName,
        },
        index
      ) in columns"
      :key="key"
    >
      <el-form-item v-if="type">
        <!-- 文本框 -->
        <el-input
          v-if="type === 'input'"
          v-model="searchData[key]"
          :placeholder="name"
          :style="{ width: pxToPx(width || 200) + 'px' }"
        />

        <!-- 范围 -->
        <el-input
          class="input-range"
          v-if="type === 'input-range'"
          v-model="searchData[key]"
          :placeholder="name"
          :style="{ width: pxToPx(width || 300) + 'px' }"
          @change="
            (v) => {
              onChange ? onChange(v, key, searchData, columns[index]) : null
            }
          "
        >
          <template v-if="append" #append>
            <template v-for="item in append" :key="item.key">
              <el-input
                v-if="item.type === 'input'"
                v-model="searchData[item.key]"
                :placeholder="item.name"
                :style="{ width: pxToPx(width || 130) + 'px' }"
                @change="
                  async (v) => {
                    item.onChange ? await item.onChange(v, item.key, searchData, item, columns[index]) : null
                  }
                "
              ></el-input>
              <span v-if="item.type === 'text'" class="name" style="padding: 0 15px">{{ item.name }}</span>
            </template>
          </template>
        </el-input>

        <!-- 下拉框 -->
        <el-select
          v-if="type === 'select'"
          v-model="searchData[key]"
          :placeholder="name"
          :clearable="clearable"
          :filterable="filterable"
          :empty-values="[null, undefined]"
          :value-on-clear="null"
          :style="{ width: pxToPx(width || 200) + 'px' }"
          @change="
            async (v) => {
              onChange ? await onChange(v, key, searchData, columns[index]) : null
            }
          "
        >
          <SelectOption :id="optionKey" :list="options" :name="optionLabel" :child-name="childName" />
        </el-select>

        <!-- 多选下拉框 -->
        <el-select
          v-if="type === 'multipleselect'"
          v-model="searchData[key]"
          :placeholder="name"
          :clearable="clearable"
          :filterable="filterable"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :style="{ width: pxToPx(width || 200) + 'px' }"
          @change="
            async (v) => {
              onChange ? await onChange(v, key, searchData, columns[index]) : null
            }
          "
        >
          <SelectOption :id="optionKey" :list="options" :name="optionLabel" :child-name="childName" />
        </el-select>

        <!-- 日期 -->
        <el-date-picker
          v-if="type === 'date'"
          v-model="searchData[key]"
          :placeholder="name"
          :clearable="clearable"
          type="date"
          :style="{ width: pxToPx(width || 200) + 'px' }"
          @change="
            async (v) => {
              onChange ? await onChange(v, key, searchData, columns[index]) : null
            }
          "
        />

        <!-- 月份区间 -->
        <el-date-picker
          v-if="type === 'monthrange'"
          v-model="searchData[key + '-' + key2]"
          range-separator="-"
          :start-placeholder="name"
          :end-placeholder="name2"
          :clearable="clearable"
          type="monthrange"
          :style="{ width: pxToPx(width || 200) + 'px' }"
          @change="
            async (v) => {
              onChange ? await onChange(v, key, searchData, columns[index]) : null
            }
          "
        />

        <!-- 日期区间 -->
        <el-date-picker
          v-if="type === 'daterange'"
          v-model="searchData[key + '-' + key2]"
          range-separator="-"
          :start-placeholder="name"
          :end-placeholder="name2"
          :clearable="clearable"
          type="daterange"
          :style="{ width: pxToPx(width || 200) + 'px' }"
          @change="
            async (v) => {
              onChange ? await onChange(v, key, searchData, columns[index]) : null
            }
          "
        />
        <!-- 日期-时间 -->
        <el-date-picker
          v-if="type === 'datetime'"
          v-model="searchData[key]"
          :placeholder="name"
          :clearable="clearable"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          type="datetime"
          :style="{ width: pxToPx(width || 200) + 'px' }"
          @change="
            async (v) => {
              onChange ? await onChange(v, key, searchData, columns[index]) : null
            }
          "
        />
        <!-- 资产分类 -->
        <AssetsCategory
          v-if="type === 'category'"
          v-model="searchData[key]"
          :width="width || 200"
          :placeholder="name"
          @change="
            async (v) => {
              onChange ? await onChange(v, key, searchData, columns[index]) : null
            }
          "
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<style scoped lang="scss"></style>
