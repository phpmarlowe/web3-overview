import { useAppStore } from '@/stores/app'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
// const { isEchartEnlarge } = storeToRefs(useAppStore())

// import { getAppEnvConfig } from "@/utils/env";

/**
 * 格式化数字，格式化为万、亿、兆、京、垓、秭、穰、沟、涧、正、载、极
 * @param {*} value 值
 * @param {number} digits 保留几位小数
 * @param {boolean} isKeep 小于万时取整
 * @param {string} placeholder 非数值占位
 * @returns {object} Returns 值、数字、单位
 */
export function formatNumber(value, digits = 2, isKeep = false, placeholder = '-') {
  const data = {
    // 只保留小数的值  -15123.00
    value: placeholder,
    // 只保留小数绝对值 15123
    abs: placeholder,
    // 保留小数并且进位的值 -1.51
    number: placeholder,
    // 保留小数并且进位的绝对值 1.51
    absNumber: placeholder,
    // 保留小数并且进位的值（带单位） -1.51万
    unitNumber: placeholder,
    // 保留小数并且进位的绝对值（带单位） 1.51万
    absUnitNumber: placeholder,
    numberToStr: placeholder,
    // 单位 万
    unit: '',
  }
  if (!isParseNumber(value)) {
    return data
  }

  // 转数字
  const number = parseFloat(value)
  // 取绝对值
  const absNumber = Math.abs(number)
  // 单位index 从1开始
  const index = parseInt(String((String(parseInt(String(absNumber))).length - 1) / 4))

  // 单位
  data.unit = '万亿兆京垓秭穰沟涧正载极'[index - 1] || ''

  // 保留小数位数
  if (isKeep && absNumber < 10000) {
    digits = 0
  }

  data.value = roundToDecimal(number, digits, true)
  data.abs = roundToDecimal(absNumber, digits, true)
  data.number = roundToDecimal(number / Math.pow(10, index * 4), digits, true)
  data.absNumber = roundToDecimal(absNumber / Math.pow(10, index * 4), digits, true)

  data.unitNumber = data.number + data.unit
  data.absUnitNumber = data.absNumber + data.unit
  data.numberToStr = number === 0 ? '否' : '是'
  return data
}

/**
 * 格式化金额 传入的时分，返回万元
 * @param value
 * @param placeholder
 * @returns {string}
 */
export function formatAmount(value, placeholder = '-') {
  if (isParseNumber(value)) {
    return formatNumber(value / 1e6, 2).value
  }
  return placeholder
}

/**
 * 数字千分符
 * @param num
 * @returns {string}
 */
export function formatNumberWithCommas(num) {
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/**
 * 四舍五入
 * @param value
 * @param digits
 * @param fix
 * @returns {number}
 */
export function roundToDecimal(value, digits, fix) {
  // 乘以10的指定小数位数次方
  const factor = Math.pow(10, digits)
  // 四舍五入
  const roundedNum = Math.round(value * factor) / factor
  return fix ? roundedNum.toFixed(digits) : roundedNum
}

/**
 * 判断值能不能转成数字
 * @param {*} value 传入值
 * @returns {boolean} 是否能转成数字
 */
export function isParseNumber(value) {
  return !isNaN(parseFloat(value))
}

export function getBasePath() {
  return 'getAppEnvConfig().VITE_GLOBAL_BASE_PATH'
}

/**
 * 转换元=>分
 * @param value
 * @returns {null|number}
 */
export function parseAmount(value) {
  if (isParseNumber(value)) {
    value = parseInt(value * 100)
    return isNaN(value) ? null : value
  }
  return null
}

/**
 * 秒转时分
 * @param second
 * @returns {string}
 */
export function parseSecond(second) {
  if (isParseNumber(second)) {
    const hour = parseInt(second / 3600)
    const minutes = parseInt((second - hour * 3600) / 60)
    second = parseInt(second) % 60
    return (
      (hour ? hour + '时' : '') +
      (minutes ? String(minutes).padStart(2, '0') + '分' : '') +
      (String(second).padStart(2, '0') + '秒')
    )
  }
  return '-'
}

/**
 * 克隆canvas
 * @param oldCanvas
 * @returns {HTMLCanvasElement}
 */
export function cloneCanvas(newCanvas, oldCanvas) {
  const context = newCanvas.getContext('2d')

  //set dimensions
  newCanvas.width = oldCanvas.width
  newCanvas.height = oldCanvas.height

  //apply the old canvas to the new one
  context.drawImage(oldCanvas, 0, 0)

  //return the new canvas
  return newCanvas
}

/**
 * 设计图px转postcss转换后的px值
 * @param px
 * @returns {number}
 */
export function pxToPx(px) {
  return (px * window.innerWidth) / 1920
}

// export function getPxFunc(px1, px2 = px1) {
//   return function getPx() {
//     // const px = isEchartEnlarge.value ? px2 : px1
//     return (px * window.innerWidth) / 1920
//   }
// }
/**
 * 字体
 * @param px
 * @returns {string}
 */
export function getFont(val) {
  return val ? 'Hiragino' : 'DINPro'
}
/**
 * 字体大小
 * @param px
 * @returns {number}
 */
export function getFontSize(type, val) {
  if (type === 1) {
    if (val === 'sm') {
      return pxToPx(15)
    }
    if (val === 'md') {
      return pxToPx(17)
    }
    if (val === 'lg') {
      return pxToPx(20)
    }
  } else {
    if (val === 'sm') {
      return pxToPx(18)
    }
    if (val === 'md') {
      return pxToPx(20)
    }
    if (val === 'lg') {
      return pxToPx(22)
    }
  }
  return pxToPx(16)
}

/**
 * 横向滚动转纵向滚动
 * @param element
 */
export function convertScrollHorizontalToVertical(element) {
  element.removeEventListener('mousewheel', () => {})
  element.addEventListener('mousewheel', (event) => {
    element.scrollLeft += event.deltaY / 2
  })
}

/**
 * 获取月份天数
 * @param date
 * @returns {number}
 */
export function getDaysByDate(date) {
  // 设置日期为今天
  const today = dayjs(date)

  // 获取当前月份的第一天
  const firstDayOfMonth = today.startOf('month')

  // 获取下个月的第一天
  const nextMonthFirstDay = today.add(1, 'month').startOf('month').format('YYYY-MM-DD')

  // 计算两个日期之间相隔的天数
  return dayjs(nextMonthFirstDay).diff(firstDayOfMonth, 'days')
}

/**
 * 获取年份列表
 * @returns {*[]}
 */
export function getYearList() {
  const currentYear = new Date().getFullYear()
  const list = []
  for (let i = 0; i < 12; i++) {
    list.push(currentYear - i)
  }
  return list
}

/**
 * 获取月份列表
 * @returns {*[]}
 */
export function getMonthList() {
  const list = []
  for (let i = 1; i <= 12; i++) {
    list.push(i)
  }
  return list
}

/**
 * 将普通数组转为jsonArray
 * @param arr
 * @param key
 */
export function toJsonArray(arr = [], formatter) {
  return arr.map((v) => ({
    key: v,
    value: formatter ? formatter(v) : v,
  }))
}

/**
 * 获取两个时间区间之中的月份
 * @param startDate
 * @param endDate
 * @param format
 * @returns {*[]}
 */
export function getYearMonthList(startDate, endDate, format) {
  const arr = []
  for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
    arr.push(format ? dayjs(date).format(format) : new Date(date))
  }
  return arr
}

/**
 * json转style字符串
 * @param map
 * @returns {string}
 */
export function convertToCss(map) {
  let cssStyle = ''
  for (const key in map) {
    cssStyle += key + '{'
    for (const name in map[key]) {
      cssStyle += camelCaseToKebabCase(name) + ':' + map[key][name] + ';'
    }
    cssStyle += '}'
  }
  return cssStyle
}

/**
 * 驼峰转连字符命名
 * @param str
 * @returns {string}
 */
export function camelCaseToKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * jsonarray扁平化
 * @param array
 * @param childKey
 * @returns {*[]}
 */
export function flatJsonArray(array, childKey) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    result.push(array[i])
    if (childKey && array[i][childKey] && array[i][childKey].length) {
      result = result.concat(flatJsonArray(array[i][childKey], childKey))
    }
  }
  return result
}

/**
 * jsonArray转map
 * @param array
 * @param idKey
 * @param childKey
 * @returns {{}}
 */
export function mapJsonArray(array, idKey, childKey) {
  let result = {}
  for (let i = 0; i < array.length; i++) {
    result[array[i][idKey]] = array[i]
    if (childKey && array[i][childKey] && array[i][childKey].length) {
      result = {
        ...result,
        ...mapJsonArray(array[i][childKey], idKey, childKey),
      }
    }
  }
  return result
}
