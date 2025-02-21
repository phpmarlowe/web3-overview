<script setup>
  import { ref, computed, watch, defineModel, onMounted } from 'vue'
  import { pxToPx } from '@/utils'
  // import { ArrowDown, CircleClose } from '@element-plus/icons-vue'
  import erd from '../utils/erd'
  import { getCategoryList } from '@/utils/category'

  // props
  const prop = defineProps({
    width: { type: Number, default: 200 },
    placeholder: { type: String, default: '' },
  })
  const { width, placeholder } = prop

  // 事件
  const emit = defineEmits(['change'])

  // 选中的ids
  const categoryIds = defineModel()

  // 是否悬浮
  const isHover = ref(false)

  // 是否可以清除
  const canClear = computed(() => Boolean(isHover.value && categoryIds.value && categoryIds.value.length))

  // 资产分类列表
  const categoryList = ref([])
  let categoryMap = ref({})
  const defaultExpandedKeys = ref([])
  getCategoryList().then(({ list, map }) => {
    categoryList.value = list
    categoryMap.value = map
    list.forEach(({ id }) => {
      defaultExpandedKeys.value.push(id)
    })
  })

  // 选中的文本
  const categorys = computed(() => {
    const arr = []
    if (categoryIds && categoryIds.value && categoryIds.value.length) {
      categoryIds.value.forEach((id) => {
        if (categoryMap.value[id]) {
          arr.push(categoryMap.value[id])
        } else {
          arr.push({
            id,
            remark: id,
          })
        }
      })
    }
    return arr
  })
  watch(categorys, () => {
    emit('change', categoryIds.value)
  })

  // 移除选项
  function removeCategory(id, upper) {
    const index = categoryIds.value.indexOf(id)
    if (index !== -1) {
      categoryIds.value.splice(index, 1)
    }
    // 父
    if (categoryMap.value[id].upper && categoryIds.value.indexOf(categoryMap.value[id].upper) !== -1) {
      removeCategory(categoryMap.value[id].upper, true)
    }
    // 子
    if (!upper) {
      categoryMap.value[id].list?.forEach(({ id }) => {
        removeCategory(id)
      })
    }
  }

  // 显示隐藏模态框
  const dialogVisible = ref(false)
  function onClosed() {
    dialogVisible.value = false
    filterText.value = ''
  }
  function handleCheckChange() {
    dialogVisible.value = false
    categoryIds.value = categoryTree.value.getCheckedKeys()
  }

  // 筛选
  const filterText = ref('')
  const categoryTree = ref(null)
  const filterNode = (value, data) => {
    if (!value) {
      return true
    }
    return data.remark.includes(value)
  }
  watch(filterText, (val) => {
    categoryTree.value.filter(val)
  })

  // 第一个tag最大宽度
  const maxWidth = computed(() => pxToPx(width - 80) - countTagWidth.value)

  // tag
  const countTag = ref(null)
  const countTagWidth = ref(0)

  // 挂载完成
  onMounted(() => {
    erd.listenTo(countTag.value, (el) => {
      countTagWidth.value = el.getBoundingClientRect().width
    })
  })
</script>

<template>
  <div
    class="el-select"
    :style="{ width: pxToPx(width) + 'px' }"
    @click="dialogVisible = true"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div
      class="el-select__tags"
      :style="{
        width: '100%',
        maxWidth: pxToPx(width - 30) + 'px',
      }"
    >
      <span class="el-select-tags-wrapper has-prefix">
        <el-tag v-if="categorys.length > 0" type="info" closable @close="removeCategory(categorys[0].id)">
          <span
            class="el-select__tags-text"
            :style="{
              maxWidth: maxWidth + 'px',
            }"
          >
            {{ categorys[0].remark }}
          </span>
        </el-tag>
        <span ref="countTag" style="margin-left: 5px">
          <el-tooltip v-if="categorys.length > 1" effect="light">
            <el-tag type="info"> + {{ categorys.length - 1 }} </el-tag>
            <template #content>
              <div class="el-select__selection">
                <div v-for="({ remark, id }, index) in categorys" :key="id" class="el-select__selection-item">
                  <el-tag v-if="index > 0" class="in-tooltip" type="info" closable @close="removeCategory(id)">
                    <span class="el-select__tags-text">
                      {{ remark }}
                    </span>
                  </el-tag>
                </div>
              </div>
            </template>
          </el-tooltip>
        </span>
      </span>
    </div>
    <el-input :placeholder="placeholder">
      <template #suffix>
        <el-icon v-if="canClear">
          <!-- todo...<component :is="CircleClose" @click.stop="categoryIds.length = 0" /> -->
        </el-icon>
        <el-icon v-else>
          <!-- <component :is="ArrowDown" /> -->
        </el-icon>
      </template>
    </el-input>
  </div>

  <!-- 选择资产分类 -->
  <el-dialog
    v-model="dialogVisible"
    class="assets-category"
    width="800px"
    top="80px"
    :append-to-body="true"
    :show-close="false"
    @close="onClosed"
  >
    <!-- header -->
    <header>
      <span>资产分类</span>
      <!-- 关闭按钮 -->
      <img class="close-btn" src="@/assets/img/home-view/guanbi.svg" alt="" @click="dialogVisible = false" />
    </header>

    <el-input v-model="filterText" placeholder="筛选" clearable />
    <div v-if="dialogVisible" style="margin-top: 15px; max-height: calc(100vh - 350px); overflow-y: auto">
      <el-tree
        ref="categoryTree"
        :data="categoryList"
        :props="{ label: 'remark', children: 'list' }"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="categoryIds"
        :filter-node-method="filterNode"
        node-key="id"
        show-checkbox
      />
    </div>

    <div ref="footer" class="footer text-right" style="margin-top: 20px">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleCheckChange">确认</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
  .in-tooltip {
    margin: 2px !important;
  }

  header {
    margin: -20px 0 20px;
    font-size: 18px;
  }

  .el-select__tags {
    position: absolute;
    line-height: normal;
    top: 50%;
    transform: translateY(-50%);
    white-space: normal;
    margin: 1px 0 0 4px;
    z-index: var(--el-index-normal);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
  }

  .close-btn {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    height: 30px;
    cursor: pointer;
  }
</style>
<style lang="scss">
  .assets-category {
    margin-bottom: 0;
  }
</style>
