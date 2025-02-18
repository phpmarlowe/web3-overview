/**封装网络请求**/
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { IMyRequestConfig } from './types'
import $router from '@/router/index'
import gableStorage from '@/utils/storage'

let loading: any = null
let errorLock = 1 // 确保只弹出一个错误

class GabRequest {
  instance: AxiosInstance
  constructor(config: IMyRequestConfig) {
    this.instance = axios.create(config)

    this.instance.interceptors.request.use(
      (config) => {
        /**
         * 请求拦截的回调，此函数必须有返回值
         */
        const token = gableStorage.get('token') || ''
        const userInfo = gableStorage.get('user') || ''

        config.headers.token = token
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

        if (!token || !userInfo) {
          $router.push('/login')
        }

        if (config.data) {
          Object.assign(config.data, { hospitalId: userInfo.hospitalId })
        } else {
          config.data = { hospitalId: userInfo.hospitalId }
        }

        loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        return config
      },
      (err) => {
        return err
      },
    )
    this.instance.interceptors.response.use(
      (res) => {
        /**
         * 响应拦截的回调，此函数必须有返回值
         */
        loading.close()

        // token 自动更新
        // 刷新token
        if (res.headers.token) {
          gableStorage.set('token', res.headers.token)
          console.log('TOKEN')
        }

        //针对不同类型报错进行处理
        if (res.data.ret === 401 && errorLock) {
          errorLock = 0
          ElMessage({
            message: '登录已过期，请您重新登录',
            type: 'error',
            plain: true,
            onClose: () => {
              errorLock = 1
            },
          })
          $router.push('/login')
        } else if (res.data.ret !== 200 && res.data.ret !== 401) {
          ElMessage({
            message: res.data.msg,
            type: 'error',
            plain: true,
            onClose: () => {
              errorLock = 1
            },
          })
        }
        return res.data
      },
      (err) => {
        ElMessage({
          message: '系统出错请联系系统管理员',
          type: 'error',
          plain: true,
          onClose: () => {
            errorLock = 1
          },
        })
        loading.close()
      },
    )
    // 可针对不同实例创建额外的拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.reqSuccessCallback,
      config.interceptors?.reqFailCallback,
    )
    this.instance.interceptors.response.use(
      config.interceptors?.resSuccessCallback,
      config.interceptors?.resFailCallback,
    )
  }

  request<T = any>(config: IMyRequestConfig<T>) {
    if (config.interceptors?.reqSuccessCallback) {
      config = config.interceptors.reqSuccessCallback(config)
    }
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.resSuccessCallback) {
            res = config.interceptors.resSuccessCallback(res)
          }
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  get<T = any>(config: IMyRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }
  post<T = any>(config: IMyRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }
  put<T = any>(config: IMyRequestConfig<T>) {
    return this.request({ ...config, method: 'PUT' })
  }
}

export default GabRequest
