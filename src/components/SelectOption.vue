<script setup>
  import { toRefs } from "vue";
  import SelectOption from "./SelectOption.vue";

  // props
  const prop = defineProps({
    list: { type: Array, default: () => [] },
    id: { type: String, default: "id" },
    name: { type: String, default: "name" },
    childName: { type: String, default: "list" },
  });
  const { list, id, name, childName } = toRefs(prop);
</script>

<template>
  <template
    v-for="item in list"
    :key="item[id]"
  >
    <el-option
      :value="item[id]"
      :label="item[name]"
    />
    <div
      v-if="childName && item[childName] && item[childName].length"
      class="option-list"
    >
      <SelectOption
        :id="id"
        :list="item[childName]"
        :name="name"
        :child-name="childName"
      />
    </div>
  </template>
</template>

<style scoped lang="scss">
  .option-list {
    padding-left: 15px;
  }
</style>
