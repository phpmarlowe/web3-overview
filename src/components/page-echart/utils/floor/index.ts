//
function arrType(points) {
  let sum_x = 0
  let sum_y = 0
  let sum_area = 0
  const p0 = points[0]
  if (points.length == 1) {
    return [p0[2], p0[0]]
  }
  let p1 = points[1]
  if (points.length == 2) {
    return [(p0[2] + p1[2]) / 2.0, (p0[0] + p1[0]) / 2.0]
  }
  for (let i = 2; i < points.length; i++) {
    const p2 = points[i]
    const area = Area(points[0], p1, p2)
    sum_area += area
    sum_x += (points[0][2] + p1[2] + p2[2]) * area
    sum_y += (points[0][0] + p1[0] + p2[0]) * area
    p1 = p2
  }
  if (sum_area == 0) {
    sum_area = 1
  }
  const xx = sum_x / sum_area / 3
  const yy = sum_y / sum_area / 3

  if (isInPolygon([yy, 0, xx], points) == false) {
    let minDis = 65535
    let newY = xx
    let newX = yy
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]
      const res = projectivePointToLine(p1, p2, [yy, 0, xx])
      if (res.result >= 0 && res.result <= 1) {
        const newP = res.point
        const dis = Math.sqrt((yy - newP.x) * (yy - newP.x) + (xx - newP.y) * (xx - newP.y))
        if (dis <= minDis) {
          minDis = dis
          newX = newP.x
          newY = newP.z
        }
      }
    }
    return [parseFloat(newY.toFixed(1)), parseFloat(newX.toFixed(1))]
  }
  return [parseFloat(xx.toFixed(1)), parseFloat(yy.toFixed(1))]
}
function Area(p0, p1, p2) {
  let area = 0.0
  area = p0[0] * p1[2] + p1[0] * p2[2] + p2[0] * p0[2] - p1[0] * p0[2] - p2[0] * p1[2] - p0[0] * p2[2]
  return area / 2
}
function isInPolygon(checkPoint, poly, isDim) {
  let dim = false
  if (typeof isDim != 'undefined' && isDim != null) {
    dim = isDim
  }

  let px = checkPoint[0]
  let py = checkPoint[2]

  if (dim) {
    px = parseInt(px)
    py = parseInt(py)
  }

  let flag = false

  for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    let sx = poly[i][0]
    let sy = poly[i][2]
    let tx = poly[j][0]
    let ty = poly[j][2]

    if (dim) {
      sx = parseInt(sx)
      sy = parseInt(sy)
      tx = parseInt(tx)
      ty = parseInt(ty)
    }

    // 点与多边形顶点重合
    if ((sx === px && sy === py) || (tx === px && ty === py)) {
      return true
    }
    if (tx == sx && px == tx && py >= (sy > ty ? ty : sy) && py <= (sy > ty ? sy : ty)) {
      return true
    }
    if (sy == ty && py == ty && px >= (sx > tx ? tx : sx) && px <= (sx > tx ? sx : tx)) {
      return true
    }

    // 判断线段两端点是否在射线两侧
    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      // 线段上与射线 Y 坐标相同的点的 X 坐标
      const x = sx + ((py - sy) * (tx - sx)) / (ty - sy)

      // 点在多边形的边上
      if (x === px) {
        return true
      }

      // 射线穿过多边形的边界
      if (x > px) {
        flag = !flag
      }
    }
  }

  // 射线穿过多边形边界的次数为奇数时点在多边形内
  return flag
}
