<template>
  <header>
    <!-- 左侧 -->
    <div class="left flex items-center w-300 text-center">
      <!-- logo -->
      <span style="cursor: pointer" @click="goHome">
        <div
          v-if="headerData.logo"
          class="w-225 h-52"
          :style="{ background: `url('${headerData.logo}') no-repeat center`, backgroundSize: 'contain' }"
        ></div>
        <div v-else class="mt-12 bg-[pink] h-52 w-225 logo"> </div>
      </span>
    </div>

    <!-- 标题 -->
    <div class="title">{{ headerData.title }}医疗设备智慧管理云平台</div>

    <!-- 右侧 -->
    <div class="right flex items-center w-300" style="position: relative">
      <!-- 系统时间 -->
      <span style="display: inline-block" class="time h-52 leading-52 w-full text-right">{{ currentDate }}</span>
    </div>
  </header>
</template>

<script setup>
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  import gableStorage from '@/utils/storage'
  import { useRoute, useRouter } from 'vue-router'

  const $router = useRouter()
  const $route = useRoute()
  console.log($route.path, 'router')

  // 标题
  const title = ref(import.meta.env.GABLE_APP_TITLE)

  // 返回主页
  function goHome() {
    if (window.opener) {
      window.close()
    } else {
      location.href = '#/home-view'
    }
  }

  // header 相关信息

  const headerData = ref({
    title: '',
    logo: '',
  })

  async function getHospitalInfo() {
    let user = gableStorage.get('user')
    let {
      data: { hospital, logoUrl },
    } = await hospitalInfoApi(user.hospitalId)
    headerData.value.title = hospital
    headerData.value.logo = logoUrl
  }
  getHospitalInfo()
  // 时间
  let currentDate = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  setInterval(() => {
    // 系统空闲
    window.requestAnimationFrame(() => {
      currentDate.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
  }, 13)

  // 跳转
  const isDaily = $route.path === '/daily'
  function jumpTo() {
    $router.push({
      path: isDaily ? '/home-view' : '/daily',
    })
  }
</script>
<style scoped lang="scss">
  header {
    position: relative;
    display: flex;
    justify-content: space-around;
    height: 7.4vh;
    overflow: hidden;
    margin: 0;
    .title {
      width: 805px;
      height: 68px;
      text-align: center;
      line-height: 68px;
      font-size: 26px;
      background: url('@assets/img/home-view/bg.png') center/100% 100% no-repeat;
      background: url('@assets/img/home-view/header-bg.png') no-repeat center/100% 100%;
    }

    .time {
      font-size: 24px;
    }
  }
  .logo {
    background: url('@assets/img/home-view/logo.png') no-repeat center;
    background-size: 80%;
  }
</style>
