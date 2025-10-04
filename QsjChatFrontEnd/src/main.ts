import { createApp } from 'vue'// 导入Vue
import App from './App.vue'// 导入App组件
import { createPinia } from 'pinia'
import {router} from '@/router'
import { useUserStore } from './store/userStore'
import { useWebSocketStore } from './store/webSocketStore'
import { useChatroomStore } from './store/chatroomStore'
import { useFriendStore } from './store/friendStore'
import './assets/global.css'// 导入全局样式

const app=createApp(App)
app.use(router)
/*
单例模式: Pinia store 使用单例模式，确保在整个应用中只有一个 store 实例。
响应式状态: Pinia 使用 Vue 的响应式系统来管理状态，因此无论在哪个地方访问或修改状态，都会同步更新。
全局注册: 通过 app.use(pinia) 将 Pinia 注册到 Vue 应用中，使得所有组件都可以访问同一个 store 实例。
*/
const pinia=createPinia()
app.use(pinia)
const userStore=useUserStore()
userStore.init()
const webSocketStore=useWebSocketStore()
webSocketStore.connect()
const chatroomStore=useChatroomStore()
chatroomStore.init()
const friendStore=useFriendStore()
friendStore.init()
// 注册全局 store
app.config.globalProperties.$userStore=userStore
app.config.globalProperties.$webSocketStore=webSocketStore
//app.provide('userStore',userStore)// 注册全局的userStore
app.mount('#app')