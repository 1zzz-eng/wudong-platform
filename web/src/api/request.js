/**
 * Axios 封装 - 统一请求管理
 * baseURL: http://localhost:3000
 */

import axios from 'axios';

// 创建 Axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动携带 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 如果后端返回了 code 字段，可在此统一处理
    if (res && res.code !== undefined && res.code !== 0 && res.code !== 200) {
      console.warn('[API] 业务错误:', res.message || '未知错误');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          // token 过期或未登录
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          // 不自动跳转，避免在非登录页时干扰
          console.warn('[API] 未授权，请重新登录');
          break;
        case 403:
          console.warn('[API] 没有权限访问');
          break;
        case 404:
          console.warn('[API] 请求的资源不存在');
          break;
        case 500:
          console.warn('[API] 服务器内部错误');
          break;
        default:
          console.warn(`[API] 请求错误 ${status}:`, data?.message || error.message);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.warn('[API] 请求超时');
    } else {
      console.warn('[API] 网络错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default request;
