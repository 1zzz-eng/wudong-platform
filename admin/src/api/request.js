import axios from 'axios'
import { message } from 'antd'

// 创建 Axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 自动附加 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 如果返回的 code 不是 200，视为业务错误
    if (res.code !== undefined && res.code !== 200 && res.code !== 0) {
      message.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    if (error.response) {
      const { status } = error.response
      // 401 未授权，跳转登录页
      if (status === 401) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_info')
        localStorage.removeItem('merchant_token')
        localStorage.removeItem('merchant_info')
        message.error('登录已过期，请重新登录')
        // 当前不在登录页才跳转
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      } else if (status === 403) {
        message.error('没有操作权限')
      } else if (status === 500) {
        message.error('服务器错误，请稍后重试')
      } else {
        message.error(error.response.data?.message || `请求失败 (${status})`)
      }
    } else if (error.code === 'ECONNABORTED') {
      message.error('请求超时，请检查网络')
    } else {
      message.error('网络异常，请检查网络连接')
    }
    return Promise.reject(error)
  },
)

export default request
