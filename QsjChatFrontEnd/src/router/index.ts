import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const routes: Array<RouteRecordRaw> = [// 路由配置
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    children:[
      {
        path: 'connect',
        name: 'connect',
        component: () => import('@/components/Connect.vue'),
        children:[
          {
            path: 'connectdetails/:id?',  // 添加参数占位符
            name: 'connectdetails',
            component: () => import('@/components/ConnectDetails.vue'),
            props: (route) => ({ id: route.query.id })  // 将查询参数传递为props
          }
        ]
      },
      {
        path: 'friends',
        name: 'friends',
        component: () => import('@/components/Friends.vue'),
        children:[
          {
            path: 'friendsdetails',
            name: 'friendsdetails',
            component: () => import('@/components/FriendDetails.vue')
          },
          {
            path: 'addfriends',
            name: 'addfriends',
            component: () => import('@/components/FriendAdd.vue')
          }
        ]
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/components/Profile.vue')
      },
      {
        path: 'settings',
        name:'settings',
        component: () => import('@/components/Settings.vue')
      },
      {
        path: 'files',
        name: 'files',
        component: () => import('@/components/Files.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),// 路由模式，使用 HTML5 历史模式,
  routes
})
//guard路由守卫,在页面加载的时候判断是否登录
/*to：目标路由对象，即用户想要导航到的路由。
from：当前导航正要离开的路由对象。
next：一个函数，用于控制导航的进行。必须调用该函数来确定导航是否继续。
*/
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if ((to.name !== 'Login' && to.name !== 'Register' )&& (!userStore.islogin || !userStore.user || userStore.meta.token === null)) {
    next({ name: 'Login' })//将导航重定向到名为 Login 的路由。
  } else {
    next()
  }
})

