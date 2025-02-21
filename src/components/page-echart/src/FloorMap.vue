<template>
  <el-button v-if="false" @click="getSence" style="position: absolute; z-index: 99999">getSence</el-button>
  <el-button v-if="false" @click="getSence_" style="position: absolute; z-index: 99999; right: 0">getSence_</el-button>
  <el-button v-if="false" @click="getSence('back')" style="position: absolute; z-index: 99999; right: 100px"
    >back</el-button
  >
  <div style="width: 100%; background-color: #90b5d0; height: 50vh; overflow: hidden; position: relative">
    <div
      class="floor-map w-1800 bg-[#35495e]"
      style="overflow: hidden; position: absolute; left: -65%; top: -38%"
    ></div>
  </div>
</template>

<script setup>
  import * as THREE from 'three'
  import * as TWEEN from '@tweenjs/tween.js' // HTML元素转化为threejs的CSS2模型对象

  import { nextTick, onMounted, watch, ref, onUnmounted } from 'vue'
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
  import { mzxMap, xkMap, getMapOption, arrType, Area, isInPolygon } from '../data/floor'
  import tag from '@/assets/img/icon/yellow.png'
  import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
  import { assetsLocationSummaryApi, assetsUseListApi } from '@/service/api/home/card'
  import { goAssetsCard } from '@/hooks/assetsCard.hook'
  import { formatNumber } from '@/utils'
  import { debounce, throttle } from '@/utils/tool'
  import { translateData } from '@/views/AssetsCard/components/middle/useMonitor/useList'
  import { useFloorMap } from '@/stores/floor-map'
  import { useUserStore } from '@/stores/user'
  const $map = useFloorMap()
  const $user = useUserStore()

  function moveCamere(x, y, z = 250) {
    new TWEEN.Tween(camera.position).to({ x, y, z }, 700).start()
    new TWEEN.Tween(controls.target).to({ x, y }, 700).start()
  }
  function getSence(params) {
    if (params == 'back') {
      new TWEEN.Tween(camera.position).to({ x: 0, y: 0, z: 1000 }, 1000).start()
      new TWEEN.Tween(controls.target).to({ x: 0, y: 0 }, 1000).start()
      return
    }
    new TWEEN.Tween(camera.position).to({ x: -1406 + fixX, y: -(205.26 + fixY), z: 250 }, 1000).start()
    new TWEEN.Tween(controls.target).to({ x: -1406 + fixX, y: -(205.26 + fixY) }, 1000).start()

    // new TWEEN.Tween(scene.scale).to({ x: 100, y: 100 }, 400).start()
    // console.log(scene)
    // camera.position.set(-1406 + fixX, -(205.26 + fixY), 300)
  }

  const $props = defineProps({
    dataSource: { type: Array, default: () => [] },
    date: { type: String, default: '' },
  })

  // 0. 初始化Three.js
  const mapOption = getMapOption($map.getMapKey($user.user.hospitalId), false)
  const {
    fixX,
    fixY,
    mapInfo,
    camera: { x, y, z },
  } = mapOption

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
  camera.position.set(x, y, z)
  let scene = new THREE.Scene()
  scene = Object.assign(scene, mapOption.sence)
  scene.rotateX(mapOption.rotateX)
  if (mapOption.AxesHelper) {
    scene.add(new THREE.AxesHelper(1000))
  }
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    shadowMapType: THREE.PCFShadowMap,
    shadowMapSoft: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  let controls = new OrbitControls(camera, renderer.domElement)
  controls = Object.assign(controls, mapOption.controls)
  // 添加环境光照
  const ambientLight = new THREE.AmbientLight(0x404040, 1000)
  scene.add(ambientLight)
  // 添加方向光照
  const directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.set(1, 1, 100).normalize()
  scene.add(directionalLight)
  // 多边形绘制方法
  function drawShape(elem) {
    const shape = new THREE.Shape()
    let { areas } = elem

    for (let i = 0; i < areas.length; i++) {
      let p = areas[i]
      let x = p[0] + fixX
      let y = p[2] + fixY
      if (i == 0) {
        shape.moveTo(x, y)
      } else {
        // shape.moveTo(x, z)
        shape.lineTo(x, y)
      }
    }

    return shape
  }
  // 创建 2d CSS2DRenderer
  let css2DRenderer = new CSS2DRenderer()
  function css2DRendererResize() {
    css2DRenderer.setSize(window.innerWidth, window.innerHeight)
  }

  // 2.创建房间
  function createRoom() {
    // let shape = null
    let rooms = mapInfo.data
    rooms.forEach((elem, index) => {
      // if (index == 0) return
      elem.roomId = elem.tenantId + '-' + index
      let { color, height } = elem
      if (index === 0) {
        return
      }
      const shape = drawShape(elem)
      const extrudeSettings = {
        steps: 1,
        depth: -height,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1,
      }
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const material = new THREE.MeshMatcapMaterial({
        color,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        matcap: new THREE.TextureLoader().load(new URL('../data/floor/matcap-room.jpg', import.meta.url)),
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.userData = Object.assign({}, elem)
      mesh.name = elem.type
      scene.add(mesh)
      mesh.rotateX(Math.PI) //绕x轴旋转
    })
  }

  // 3.创建墙体
  function createWall() {
    // let shape = null
    let rooms = mapInfo.wall
    rooms.forEach((elem, index) => {
      if (index == 0) return
      const { color, height } = elem

      const shape = drawShape(elem)
      const extrudeSettings = {
        steps: 0,
        depth: -height + 4,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 1,
        bevelSegments: 1,
      }
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const material = new THREE.MeshMatcapMaterial({
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        matcap: new THREE.TextureLoader().load(new URL('../data/floor/matcap-wall-1.jpg', import.meta.url)),
      })
      // material.matcap = matcapTexture()
      const mesh = new THREE.Mesh(geometry, material)
      mesh.userData = Object.assign({}, elem)
      mesh.name = elem.type
      mesh.rotateX(Math.PI) //绕x轴旋转
      scene.add(mesh)
    })
  }

  // 3.创建地板
  function createZoneInfo() {
    // let shape = null
    let rooms = mapInfo.zoneInfo
    rooms.forEach((elem, index) => {
      const { color, height } = elem

      const shape = drawShape(elem)

      const extrudeSettings = {
        steps: 1,
        depth: -height,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1,
      }
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const material = new THREE.MeshMatcapMaterial({
        color: '#ffffff',
        transparent: true,
        side: THREE.DoubleSide,
        matcap: new THREE.TextureLoader().load(new URL('../data/floor/matcap-wall-1.jpg', import.meta.url)),
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.userData = Object.assign({}, elem)
      mesh.name = elem.type
      mesh.rotateX(Math.PI) //绕x轴旋转
      scene.add(mesh)
    })
  }

  // 6.
  // 创建一个HTML标签
  function tag3D(x, y, data, index = 0) {
    const divElement = document.createElement('div')

    // 可点击的大头针
    const img = new Image()
    img.width = 20
    img.height = 20

    if (data.runningState === '0') {
      img.src = new URL('@/assets/img/icon/green.png', import.meta.url)
    }
    if (data.runningState === '1') {
      img.src = new URL('@/assets/img/icon/yellow.png', import.meta.url)
    }
    if (data.runningState === '2') {
      img.src = new URL('@/assets/img/icon/red.png', import.meta.url)
    }
    img.style.pointerEvents = 'auto'
    img.onclick = function (e) {
      createToolTips(x, y, data, index)
    }

    divElement.style.position = 'relative'
    divElement.style.zIndex = index
    divElement.appendChild(img)
    const toolBox = document.createElement('div')

    divElement.appendChild(toolBox)
    const tag = new CSS2DObject(divElement)
    tag.name = 'tag'
    // // 设置宽高
    // css2DRendererResize()
    // x = -1147.14
    // y = 239.15
    tag.position.x = x + fixX
    tag.position.y = -(y + fixY)
    tag.position.z = 2
    scene.add(tag)
    return tag
  }
  function createToolTips(x, y, data, index) {
    const {
      assetsId = index,
      assetsName = '',
      address = '',
      assetsNo = '',
      department = '',
      mainBusinessType = '',
      powerOnUseRate = '',
      currentUseCount = 0,
    } = data
    // css2DRenderer = new CSS2DRenderer()
    removeTag('toolTip')
    const tooltip = document.createElement('div')
    // 可点击的大头针

    tooltip.style.position = 'relative'
    tooltip.innerHTML = `<div class='test' id="${assetsId}" style="position:absolute;left:0rem;top:-50px">
               <div
           style="
             min-width: 3rem;
             height: 170px;
             color: white;
             position: relative;
             display: flex;
             flex-direction: column;
             justify-content: space-around;
             padding: 15px;
             margin-left: 30px;
             font-size:15px;
             white-space:nowrap;
             border-radius:5px;
             background:#153054 !important

           "
           class="echart-tooltip-wrapper"
         >
           <div  style="white-space:nowrap;font-size:1.1em">
             <span>资产名称：${assetsName}</span>
             <span id="detail" style="font-size:1em; margin-left: 10px; color: #00b4ed; text-decoration: underline; cursor: pointer">
               详情
             </span>
           </div>
           <div style="display: flex; justify-content: space-between;gap:20px">
             <span  class="text-ellipsis auto-ellipsis">位置：${address}</span>
             <span style="flex: 1">主要业务类型：${mainBusinessType ? mainBusinessType : ''}</span>
           </div>
           <div style="display: flex; justify-content: space-between;gap:20px;">
             <span class="text-ellipsis auto-ellipsis">资产编号：<span class="number-value" style="font-size:1.2em">${assetsNo}</span>
             </span>
             <span style="flex: 1">当日使用人次: <span  class="number-value" style="font-size:1.2em">${currentUseCount}</span>

             </span>
            </div>
           <div style="display: flex; justify-content: space-between;gap:20px">
             <span class="text-ellipsis auto-ellipsis">所属科室：${department}</span>
             <span style="flex: 1">开机使用率：<span class="number-value" style="font-size:1.2em">${formatNumber(powerOnUseRate * 100, 2).value}%</span></span>
           </div>

           <span
            id="三角形_"
             style="
               position: absolute;
               border-top: 10px solid transparent;
               border-bottom: 10px solid transparent;
               border-right: 20px solid #153054;
               left: -20px;
               top: 50px;
             "
           ></span>



             <span
              id="use-list-tri_"
              style="
                position: absolute;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-right: 20px solid #153054;
                right:-20px;
                top:80px;
                zIndex:9999999;
                display:none;
              "
            ></span>

          <div id="use-list-content_" class="map-content" style="min-width: 120px;position:absolute;right:-805px;top:60px;height:500px;background:#153054;display:none;">
             <div class="close click-close" id="click-close">+</div>
              <div class="table-wrapper">
                <table class="is-fixed">
                  <thead>
                    <tr>
                      <td><div>日期</div></td>
                      <td><div>开机次数</div></td>
                      <td><div>开机时段</div></td>
                      <td><div>开机时长</div></td>
                      <td><div>运行次数</div></td>
                      <td><div>运行时段</div></td>
                      <td><div>运行时长</div></td>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
         </div>

           </div>`
    setTimeout(() => {
      document.getElementsByClassName('test')[0].parentElement.setAttribute('class', 'testF')

      document.getElementById('detail').onclick = () => {
        // 跳转设备页面逻辑
        goAssetsCard({}, data)
      }

      document.getElementById('click-close').onclick = () => {
        // 跳转设备页面逻辑

        let elem = document.getElementById('use-list-content_')
        let elem2 = document.getElementById('use-list-tri_')
        elem.style.display = 'none'
        elem2.style.display = 'none'
      }

      for (var i = 0; i < document.getElementsByClassName('auto-ellipsis').length; i++) {
        document.getElementsByClassName('auto-ellipsis')[i].addEventListener('mouseenter', function () {
          // 这里是点击事件触发时的操作
          setTimeout(() => {
            this.classList.remove('text-ellipsis')
          }, 300)
        })
        document.getElementsByClassName('auto-ellipsis')[i].addEventListener('mouseleave', function () {
          setTimeout(() => {
            this.classList.add('text-ellipsis')
          }, 300)
        })
      }
    }, 20)
    tooltip.style.pointerEvents = 'auto'
    const tooltipObj = new CSS2DObject(tooltip)
    tooltipObj.position.x = x + fixX
    tooltipObj.position.y = -(y + fixY)
    tooltipObj.name = 'toolTip'
    scene.add(tooltipObj)
    return tooltip
  }
  // 7. 创建文本
  function createText(x, y, data, index = 0) {
    const divElement = document.createElement('div')
    divElement.innerHTML = `<span style="text-shadow:-1px 0 white,0 1px white,1px 0 white,0 -1px white">${data.title || data.address.split(' ').pop()}</span>`
    divElement.style.color = '#666666'
    divElement.style.fontSize = '12px'

    const text = new CSS2DObject(divElement)

    text.name = 'text'
    text.position.x = x + fixX
    text.position.y = -(y + fixY)
    text.position.z = 1
    scene.add(text)
  }

  watch(
    () => $props.dataSource,
    (val) => {
      renderTag(val)
    },
    { deep: true, immediate: true },
  )
  function renderTag(val) {
    if (val.assetsLocationList && val.assetsLocationList.length) {
      nextTick(() => {
        let aaa = []
        // 小地图没有顶部 使用中、待机、关机 等状态默认选中资产总数
        if (true || val.currentClickWlwStatus == -1) {
          aaa = val.assetsLocationList
        } else if (val.currentClickWlwStatus == 0) {
          aaa = val.assetsLocationList.filter((e) => {
            return e.runningState == 0
          })
        } else if (val.currentClickWlwStatus == 1) {
          aaa = val.assetsLocationList.filter((e) => {
            return e.runningState == 1
          })
        } else {
          aaa = val.assetsLocationList.filter((e) => {
            return e.runningState == 2
          })
        }
        createTags(aaa)
      })
    } else {
      removeTag('tag')
      removeTag('text')
    }
  }
  let currentRenderList = ref([])
  function createTags(list) {
    removeTag('tag')
    removeTag('toolTip')
    removeTag('text')
    currentRenderList.value = list
    const rooms = []
    list.forEach((e, i) => {
      const { x, z: y } = e
      const index = rooms.findIndex((elem, index) => {
        return elem.address === e.address
      })
      if (index === -1) {
        rooms.push(e)
        createText(e.x, e.z + 20, e)
      }

      tag3D(x, y, e, i)
    })
  }

  function removeTag(name) {
    let arr = []
    scene.children.forEach((e) => {
      if (e.name === name) {
        arr.push(e)
      }
    })
    arr.forEach((e) => {
      scene.remove(e)
    })
  }

  //0.0
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
    css2DRenderer.render(scene, camera)
    TWEEN.update()
    // TWEEN.update(10000) //tween更新
    // console.log(pos.x, pos.y)
  }
  onMounted(() => {
    document.getElementsByClassName('floor-map')[0].appendChild(renderer.domElement)
    document.body.style.position = 'relative'
    document.getElementsByClassName('floor-map')[0].appendChild(css2DRenderer.domElement)
    css2DRenderer.domElement.style.position = 'absolute'
    css2DRenderer.domElement.style.top = '0px'
    css2DRenderer.domElement.style.pointerEvents = 'none'
    css2DRendererResize()
    createWall()
    createZoneInfo()
    createRoom()
    // createLine()
    animate()

    const raycaster = new THREE.Raycaster()
    raycaster.ray.direction = new THREE.Vector3(fixX, 1, 0)
    const pointer = new THREE.Vector2()
    function render(event) {
      console.log(event, event.target, event.target instanceof HTMLImageElement)
      if (event.target instanceof HTMLImageElement) return
      removeTag('toolTip')
      // let x = event.clientX - renderer.domElement.getBoundingClientRect().left
      // let y = event.clientY - renderer.domElement.getBoundingClientRect().top

      // let canvasWidth = renderer.domElement.clientWidth
      // let canvasHeight = renderer.domElement.clientHeight

      // // 通过摄像机和鼠标位置更新射线
      // pointer.x = (x / canvasWidth) * 2 - 1
      // pointer.y = -(y / canvasHeight) * 2 + 1
      // console.log(x, y)

      // console.log(pointer)

      // raycaster.setFromCamera(pointer, camera)

      // // 计算物体和射线的焦点
      // let room = null
      // const intersects = raycaster.intersectObjects(scene.children)
      // console.log('==>', intersects)

      // let myPosition = { x: 0, y: 0 }
      // for (let i = 0; i < intersects.length; i++) {
      //   if (intersects[i].object.name == 'room' || intersects[i].object.name == 'zone') {
      //     intersects[i].object.material.color.set('rgb(240, 20, 97)')
      //     // change(intersects[i].object)

      //     const pos = new THREE.Vector3()
      //     let a = intersects[i].object.getWorldPosition(pos)
      //     let aPosition = arrType(intersects[i].object.userData.areas)
      //     moveCamere(intersects[i].point.x, intersects[i].point.y)
      //     console.log(intersects[i].object.userData.areas, aPosition, 'aaaa')
      //   }
      // }
      // if (intersects.length > 0) {
      //   //
      // }
      renderer.render(scene, camera)
    }
    window.addEventListener('click', render)
    window.onresize = throttle(() => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.render(scene, camera)
      // 宽高比改变时防止地图变形
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      createTags(currentRenderList.value)
      css2DRendererResize()
    }, 200)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', null)
  })

  // 接口
  async function getUseList(assetsNo) {
    let elem = document.getElementById('use-list-content_')
    let elem2 = document.getElementById('use-list-tri_')
    let res = await assetsUseListApi({
      assetsNo,
      startTime: $props.date,
      endTime: $props.date,
    })
    let tableHtml = ''

    translateData(res.data.list).forEach((tr) => {
      tableHtml += '<tr>'
      tr.forEach(([value, colspan]) => {
        tableHtml += `<td rowspan="${colspan}">${value}</td>`
      })
      tableHtml += '</tr>'
    })
    elem.querySelector('tbody').innerHTML = tableHtml

    elem.style.display = 'block'
    elem2.style.display = 'block'
  }

  // 画线
  function createLine() {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      -1380 + fixX,
      532 + fixY,
      0, // 起点坐标
      -1413 + fixX,
      329 + fixY,
      0, // 终点坐标
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const material = new THREE.LineBasicMaterial({ color: 'red', height: 10 })
    const line = new THREE.Line(geometry, material)
    line.rotateX(Math.PI) //绕x轴旋转
    line.position.z = 10
    scene.add(line)

    // 假设我们有两个点的世界坐标: startPoint 和 endPoint
    const startPoint = new THREE.Vector3(-1380 + fixX, 532 + fixY, 0)
    const endPoint = new THREE.Vector3(-1413 + fixX, 329 + fixY, 0)
    // 创建一个raycaster实例
    const raycaster = new THREE.Raycaster()
    // 创建一条射线，从startPoint向endPoint发射
    raycaster.set(startPoint, new THREE.Vector3().subVectors(endPoint, startPoint).normalize())
    // 创建一个array来存储所有碰撞的对象
    const collisions = []

    // 循环检查场景中的所有物体
    scene.traverse((child) => {
      if (child.isMesh) {
        // 使用raycaster检测碰撞
        const intersects = raycaster.intersectObject(child)
        if (intersects.length > 0) {
          collisions.push(...intersects)
        }
      }
    })
    console.log(collisions, 'cooo')

    // 如果有碰撞，计算一个新的路径点使线不穿过模型
    if (collisions.length > 0) {
      const firstCollision = collisions[0]
      const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize()
      const newEndPoint = firstCollision.point.clone().sub(direction.clone().multiplyScalar(5)) // 5是避免线穿过物体的一个偏移量

      // 使用这两个点创建Line
      const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, newEndPoint])
      const material = new THREE.LineBasicMaterial({ color: 'black' })
      const lines = new THREE.Line(geometry, material)
      lines.rotateX(Math.PI) //绕x轴旋转
      scene.add(lines)
      lines.position.z = 10
    }
  }

  defineExpose({
    createTags,
  })
</script>

<style lang="scss">
  .testF {
    z-index: 350 !important;
    user-select: all;
  }

  .close {
    float: right;
    margin: 0 5px 15px;
    transform: rotate(45deg);
    font-size: 30px;
    color: #fff;
    cursor: pointer;
  }
</style>
<style lang="scss">
  // .table-wrapper {
  //   width: 100%;
  //   min-width: 900px;
  //   max-height: 80vh;
  //   overflow-x: hidden;
  //   overflow-y: auto;
  //   resize: both;
  // }

  .map-content {
    filter: none;
    overflow-y: scroll !important;
    overflow-x: hidden;
    padding: 10px;
    table {
      thead {
        position: sticky;
      }
      border-collapse: collapse; /* 设置为合并边框 */
      overflow: scroll;
      td {
        padding: 0 15px;
        text-align: center;
        border: 1px solid white;
        white-space: nowrap;
      }

      &.is-fixed {
        thead td {
          position: sticky !important;
          padding-left: 0;
          padding-right: 0;
          border: none;

          > div {
            padding: 0 8px;
            border: 1px solid white;
          }
        }
      }
    }
  }
</style>
<script></script>
