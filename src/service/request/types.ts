import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'

export interface IMyRequestConfig<T = AxiosResponse>
  extends AxiosRequestConfig {
  interceptors?: {
    reqSuccessCallback?: (
      config: AxiosRequestConfig,
    ) => InternalAxiosRequestConfig // 请求成功参数
    reqFailCallback?: (err: any) => any
    resSuccessCallback?: (res: T) => T // res:{code:xxx,message:'',data:{}}  此处类型不能写死
    resFailCallback?: (err: any) => any
  }
}
