import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/home'), meta: { isRecord: true, top: 0 } },
      { path: '/qa', name: 'qa', component: () => import('@/views/qa') },
      { path: '/video', name: 'video', component: () => import('@/views/video') },
      { path: '/my', name: 'my', component: () => import('@/views/my') }
    ]
  },
  { path: '/search', name: 'search', component: () => import('@/views/search') },
  { path: '/article/:articleId', name: 'article', props: true, component: () => import('@/views/article'), meta: { isRecord: true, top: 0 } },
  { path: '/user/profile', name: 'user-profile', component: () => import('@/views/user-profile') },
  // 小思聊天的路由规则
  { path: '/chat', name: 'chat', component: () => import('@/views/chat') }
]

// 1. 创建路由的实例对象
const router = new VueRouter({
  routes
})

// 所有有权限页面的路径，都在这个数组之中
const pagePathArr = ['/user/profile']

// 2. 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 2.1 访问的是有权限的页面，需要判断用户是否登录
    // 1. 从 store 中获取 token 的值
    const tokenStr = store.state.user
    if (tokenStr) {
      // 1.1 token 有值，已登录过（操作：直接放行）
      next()
    } else {
      // 1.2 token 不存在，没有登录（操作：强制跳转到登录页）
      next('/login')
    }
  } else {
    // 访问的是没有权限的页面
    next()
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top)
      console.log('到达组件的位置是', to.meta.top)
    }, 0)
  }
})

export default router
