import { formatNumber } from '@/utils'

export const deploymentTConfig = {
  propsList: [
    {
      type: 'normal',
      prop: 'sflb',
      label: '业务类型',
      minWidth: 50,
      // formatter: (value) => (value ?/ dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    { type: 'normal', prop: 'fwxcB', label: '去年服务项次' },
    {
      type: 'normal',
      prop: 'fwxcA',
      label: '今年服务项次',
      minWidth: 50,
    },
    { type: 'normal', prop: 'differenceFwxc', label: '差额', minWidth: 50 },
    {
      type: 'normal',
      prop: 'fwxcProportion',
      label: '浮动比例',
      minWidth: 40,
      formatter: (value) => {
        return formatNumber(value * 100, 2).value
      },
    },
  ],
  childrenTree: {
    stripe: true,
    'max-height': '50vh',
  },
  showPagenation: true,
}
