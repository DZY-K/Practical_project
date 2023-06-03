import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/fonts/iconfont.css'
import '@/assets/css/global.css'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 路由跳转显示进度条 nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 隐藏 右侧浏览器 滚动条
import VueSmoothScroll from 'vue2-smooth-scroll'
Vue.use(VueSmoothScroll)
Vue.use(VueQuillEditor)
Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false
Vue.use(ElementUI)
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// request 拦截器
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// response拦截器
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})
// 自定义时间过滤器
Vue.filter('dateFormat', function (originVal) {
  // padStart(2, '0') 表示字符串不足两位用0填充
  const dt = new Date(originVal)
  const Y = dt.getFullYear()
  const M = (dt.getMonth() + 1 + '').padStart(2, '0')
  const D = (dt.getDate() + '').padStart(2, '0')
  const h = (dt.getHours() + '').padStart(2, '0')
  const m = (dt.getMinutes() + '').padStart(2, '0')
  const s = (dt.getSeconds() + '').padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
