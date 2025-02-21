<script setup lang="ts">
  import { toRefs, defineProps, ref, onMounted } from 'vue'

  // props
  interface IConfig {
    titleConfig: any[]
  }
  const prop = defineProps<IConfig>()
  // emit
  const emit = defineEmits(['changeTitle'])

  const currentClick = ref(0)
  function changeTitle(index: number) {
    currentClick.value = index
    emit('changeTitle', currentClick.value)
  }
  onMounted(() => {
    prop.titleConfig.forEach((elem, index) => {
      if (elem.active) {
        changeTitle(index)
      }
    })
  })
</script>

<template>
  <ul class="title-list">
    <li
      v-for="(item, index) in prop.titleConfig"
      :key="item.name"
      :class="{ active: index === currentClick }"
      @click="changeTitle(index)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
  .title-list {
    display: flex;
    margin-left: -15px;
    font-size: $font-lg;
    li {
      padding: 0 20px 10px;
      color: #fff;
      border-bottom: 3px solid #2c4468;
      cursor: pointer;

      &.active {
        border-bottom-color: #c8dafe;
      }
    }
  }
</style>
