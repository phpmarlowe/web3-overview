# Ga-Table 组件

## 使用方式

1. 传入`table-config`配置

```
interface table {
  propsList: { label: '菜单名称', prop: 'name', width: '180px' }[]  // columns 渲染数据
  childrenTree?: { // 树形表格必传
    rowKey: 'id',
    treeProps: {
      children: 'children'
    }
  }
}

```

2. propsList 的数据项支持传入 type 属性，当值为 custom 时 渲染内容将通过插槽形式交由夫组件传入完全自定义内容

## 注意事项
