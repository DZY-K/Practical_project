import store from '@/store'
import axios from 'axios'
import JSONBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://geek.itheima.net',
  // baseURL: 'http://www.liulongbin.top:8000'
  // baseURL: 'http://127.0.0.1:3007'
  // baseURL: 'http://123.57.109.30:8000'
  // 自定义后端的原始数据
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// 请求拦截器--发起请求之前配置token
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // 本次请求的请求配置对
  // console.log(config)
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 这里要返回config ，不然请求就会停在这个里
  return config
}, function (error) {
  return Promise.reject(error)
})
export default request
