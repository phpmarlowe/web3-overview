import GabRequest from './request'
import { BASE_URL, TIME_OUT } from './config'

const gabRequest = new GabRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
})

export default gabRequest
