export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 'postcss-px-to-viewport-8-plugin': {
    //   // 需要转换的单位
    //   unitToConvert: 'px',
    //   // 设计稿的视口宽度
    //   viewportWidth: 1920,
    //   // 单位转换后保留的精度
    //   unitPrecision: 6,
    //   // 能转化为 vw 的属性列表
    //   propList: ['*'],
    //   // 希望使用的视口单位
    //   viewportUnit: 'vw',
    //   // 字体使用的视口单位
    //   fontViewportUnit: 'vw',
    //   /*
    //    * 需要忽略的 CSS 选择器，不会转为视口单位，使用原有的 px 等单位
    //    * "slide-auth-content"
    //    */
    //   selectorBlackList: [],
    //   /*
    //    * 设置最小的转换数值
    //    * 如果为 1 的话，只有大于 1 的值会被转换
    //    */
    //   minPixelValue: 1,
    //   // 媒体查询里的单位是否需要转换单位
    //   mediaQuery: false,
    //   // 是否直接更换属性值，而不添加备用属性
    //   replace: true,
    //   // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
    //   exclude: [/src\/views\/exception/, /src\/views\/Print/],
    //   // 只有匹配到的文件才会被转换
    //   include: [],
    //   // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
    //   landscape: false,
    //   /*
    //    * 横屏时使用的单位
    //    * landscapeUnit: "vw",
    //    * 横屏时使用的视口宽度
    //    * landscapeWidth: 1980,
    //    */
    // },
    'postcss-pxtorem': {
      rootValue: 100, // (Number | Function) 表示根元素字体大小或根据input参数返回根元素字体大小
      unitPrecision: 5, // （数字）允许 REM 单位增长到的十进制数字
      propList: ['*'], // 可以从 px 更改为 rem 的属性 使用通配符*启用所有属性
      selectorBlackList: [], // （数组）要忽略并保留为 px 的选择器。
      replace: true, // 替换包含 rems 的规则，而不是添加回退。
      minPixelValue: 1, // 最小的转化单位
      // exclude: /node_modules/i, // 要忽略并保留为 px 的文件路径
    },
  },
}
