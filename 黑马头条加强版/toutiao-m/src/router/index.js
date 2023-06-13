import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue'
Vue.use(VueRouter)

const routes = [
  // { path: '', redirect: '/login' },
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/Layout'),
    children: [
      { path: '', redirect: '/home' },
      { path: '/home', name: 'home', component: () => import('@/views/home') },
      { path: '/answer', name: 'answer', component: () => import('@/views/answer') },
      { path: '/video', name: 'video', component: () => import('@/views/video') },
      { path: '/my', name: 'my', component: () => import('@/views/My') },
      { path: '/search', name: 'search', component: () => import('@/views/search') },
      { path: '/article/:articleId', name: 'article', props: true, component: () => import('@/views/article') }
    ]

  }
]

const router = new VueRouter({
  routes
})

export default router
