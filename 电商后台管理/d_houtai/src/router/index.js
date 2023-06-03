import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
// import Login from '@/views/login/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/login/Login.vue')
// import Home from '@/views/home/home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/home/home.vue')
// import Welcome from '@/components/welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/welcome.vue')
// import User from '@/components/user/Users.vue'
const User = () => import(/* webpackChunkName: "User_Rights_Roles" */ '../components/user/Users.vue')
// import Rights from '@/components/power/rights.vue'
const Rights = () => import(/* webpackChunkName: "User_Rights_Roles" */ '../components/power/rights.vue')
// import Roles from '@/components/power/roles.vue'
const Roles = () => import(/* webpackChunkName: "User_Rights_Roles" */ '../components/power/roles.vue')
// import Categories from '@/components/goods/categories.vue'
const Categories = () => import(/* webpackChunkName: "Categories_Params_GoodList" */ '../components/goods/categories.vue')
// import Params from '@/components/goods/params.vue'
const Params = () => import(/* webpackChunkName: "Categories_Params_GoodList" */ '../components/goods/params.vue')
// import GoodList from '@/components/goods/goodList.vue'
const GoodList = () => import(/* webpackChunkName: "Categories_Params_GoodList" */ '../components/goods/goodList.vue')
// import AddGoods from '@/components/goods/addGood.vue'
const AddGoods = () => import(/* webpackChunkName: "AddGoods_Orders_Reports" */ '../components/goods/addGood.vue')
// import Orders from '@/components/order/Order.vue'
const Orders = () => import(/* webpackChunkName: "AddGoods_Orders_Reports" */ '../components/order/Order.vue')
// import Reports from '@/components/report/Reports'
const Reports = () => import(/* webpackChunkName: "AddGoods_Orders_Reports" */ '../components/report/Reports')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodList },
      { path: '/orders', component: Orders },
      { path: '/goods/add', component: AddGoods },
      { path: '/reports', component: Reports }

    ]

  }

]

const router = new VueRouter({
  routes
})
// 路由导航
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
