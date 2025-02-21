import * as THREE from 'three'
import mzxMap from './mzx.map'
import xkMap from './xk.map'
import { Area, arrType, isInPolygon } from './tool'
/**
 * @param type 地图类型
 * @param isLarge 是否是放大后地图
 * sence、controls 中必须是 three 中存在的属性
 * @returns 地图配置项
 */
function getMapOption(type, isLarge) {
  let option = {}
  switch (type) {
    case 'mzx':
      option = {
        fixX: isLarge ? 1250 : 1300,
        fixY: isLarge ? -250 : -350,
        mapInfo: mzxMap,
        sence: {
          background: isLarge ? null : new THREE.Color('#12265b'),
        },
        rotateX: 0,
        controls: {
          zoomToCursor: true,
          enablePan: true, // 平移
          enableZoom: true, // 缩放
          enableRotate: false, // 旋转
        },
        camera: {
          x: 0,
          y: 0,
          z: isLarge ? 550 : 1000,
        },
        AxesHelper: false,
      }
      break
    case 'xk':
      option = {
        fixX: isLarge ? 150 : 200,
        fixY: isLarge ? -180 : -280,
        mapInfo: xkMap,
        sence: {
          background: isLarge ? null : new THREE.Color('#12265b'),
        },
        camera: {
          x: 0,
          y: 0,
          z: isLarge ? 750 : 1350,
        },
        rotateX: isLarge ? -0.1 : -0.1,
        controls: {
          zoomToCursor: true,
          enablePan: true, // 平移
          enableZoom: true, // 缩放
          enableRotate: false, // 旋转
        },
        AxesHelper: false,
      }
      break
    default:
      option = {
        fixX: 300,
        fixY: -650,
        mapInfo: mzxMap,
        sence: {
          background: new THREE.Color('#12265b'),
        },
        controls: {
          zoomToCursor: true,
          enablePan: true, // 平移
          enableZoom: true, // 缩放
          enableRotate: true, // 旋转
        },
        AxesHelper: false,
      }
      break
  }
  console.log(option, 'optionsss')

  return option
}

export { mzxMap, xkMap, getMapOption, Area, arrType, isInPolygon }
