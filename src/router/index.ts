import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouterOptions } from 'vue-router'

import { baseRoutes, homeRoutes } from './modules'
import gableStorage from '@/utils/storage'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes, ...homeRoutes],
} as RouterOptions)

const whiteList: string[] = [] // 免登白名单

// router.beforeEach((to, from, next) => {
//   if (to.meta && to.meta.title) {
//     ;(window.document.title as any) = to.meta.title // 设置页面标题
//   } else {
//     // ;(window.document.title as any) = import.meta.env.GABLE_APP_TITLE
//   }
//   const { path } = to
//   if (path === '/login') gableStorage.clear()

//   if (path === '/login' || whiteList.includes(path)) {
//     next()
//   } else {
//     const token = gableStorage.get('token')
//     if (token) {
//       next() // axios 请求时 token 失效跳转登录页
//     } else {
//       router.push('/login')
//     }
//   }
// })

export default router
