import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'
import { exchangeTokenAPI } from '@/api/user.js'

const request = axios.create({
  baseURL: 'http://www.liulongbin.top:8000',
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(config => {
  const { user } = store.state
  if (user && user.token) {
    // 注意Bearer后面有个空格
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 必须要返回config
  return config
}, function (err) {
  return Promise.reject(err)
})

/*
// 方案 1：判断token过期，清空vuex数据并强制跳到登录页
// 响应拦截器
request.interceptors.response.use(response => {
  // 隐藏loading的提示效果
  Toast.clear()
  // 必须要返回response
  return response
}, function (error) {
  // 在请求失败的时候，关闭 loading 提示效果
  Toast.clear()
  // 如果有响应的结果，并且响应的状态码是 401，则证明 Token 过期了
  if (error.response && error.response.status === 401) {
    console.log('Token 过期了')
    // TODO1：清空 vuex 和 localStorage 中的数据
    store.commit('cleanState')
    // TODO2：强制跳转到登录页，并通过路由的 query 查询参数，把当前用户“访问未遂的路由地址”带给登录页
    router.replace('/login?pre=' + router.currentRoute.fullPath)
  }
  return Promise.reject(error)
})
*/

// 方案 2：无感知刷新 Token

request.interceptors.response.use(response => {
  // 隐藏loading的提示效果
  Toast.clear()
  return response
}, async (error) => {
  // 隐藏loading的提示效果
  Toast.clear()
  // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
  const tokenInfo = store.state.user
  console.log('token是', tokenInfo)
  // 2. 判断是否为 token 过期
  if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
    // token 过期
    console.log('token过期啦')
    try { // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
      const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
      console.log(res)
      // 3.2 TODO: 更新 Store 中的 Token
      store.setUser({ token: res.data.token, refresh_token: tokenInfo.refresh_token })
      // 3.3 重新调用刚才“请求未遂”的接口
      // 3.3.1 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
      return request(error.config)
    } catch (error) {
      //  token 和 refresh_token 都失效了
      // 4.1 清空 vuex 和 localStorage
      store.commit('cleanState')
      // 4.2 强制跳转到登录页
      router.replace('/login?pre=' + router.currentRoute.fullPath)
    }
  }
  return Promise.reject(error)
})

export default request
