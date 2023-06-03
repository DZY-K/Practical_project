import axios from 'axios'
const request = axios.create({
  // baseURL: 'http://toutiao.itheima.net/v1_0',
  // baseURL: 'http://www.liulongbin.top:8000',
  baseURL: 'http://127.0.0.1:3007'
  // baseURL: 'http://toutiao.itheima.net',
})
export default request
