import axios from 'axios'

//创建axios实例对象
const request = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  timeout: 600000
})

// //axios的请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果是注册请求，不需要token
    if (!config.url.includes('/register')) {
      const loginUser = JSON.parse(localStorage.getItem('loginUser'))
      if (loginUser && loginUser.token) {
        config.headers.token = loginUser.token
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    return Promise.reject(error)
  }
)

export default request