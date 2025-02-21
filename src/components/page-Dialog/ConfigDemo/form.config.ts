import { useDeployTypeCardStore } from '@/stores/deploy-type-card'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const { businessTypeList } = storeToRefs(useDeployTypeCardStore())
export const deploymentFConfig: any = ref([])
watch(
  businessTypeList,
  () => {
    deploymentFConfig.value = [
      {
        name: '业务类型',
        key: 'sflb',
        type: 'select',
        options: businessTypeList,
        optionKey: 'name',
        optionLabel: 'name',
        // onChange: $overview.setDepartmentAction,
      },
      {
        name: '开始时间',
        key: 'startTime',
        name2: '结束时间',
        key2: 'endTime',
        type: 'monthrange',
        clearable: false,
      },
    ]
  },
  { immediate: true, deep: true },
)
