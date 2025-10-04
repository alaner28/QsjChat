import { defineStore } from 'pinia'
import {ref} from 'vue'
import { type User } from '../types/user.ts'
import{loginUrl, TokenUrl} from '../static.ts'

// 获取当前会话的标识符，用于区分不同标签页
function getSessionIdentifier() {
    // 从sessionStorage获取或生成会话ID
    let sessionId = sessionStorage.getItem('vueAppSessionId');//每个标签页的sessionStorage是独立的
    if (!sessionId) {
        // 生成唯一会话ID
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        sessionStorage.setItem('vueAppSessionId', sessionId);
    }
    return sessionId;
}

// 获取基于用户ID和会话的存储键
function getStorageKey(baseKey: string, userId?: string) {
    const sessionId = getSessionIdentifier();
    // 如果有用户ID，使用用户ID和会话ID组合；否则只使用会话ID
    if (userId) {
        return `${baseKey}_user_${userId}_${sessionId}`;
    }
    return `${baseKey}_${sessionId}`;
}

// 获取当前存储的用户ID
function getStoredUserId() {
    // 检查URL参数、sessionStorage或其他地方是否有用户标识
    // 这里简化处理，实际应用可能需要更复杂的逻辑
    const sessionId = getSessionIdentifier();
    const userIdKey = `current_user_id_${sessionId}`;
    return sessionStorage.getItem(userIdKey);
}

// 存储当前用户ID
function storeCurrentUserId(userId: string) {
    const sessionId = getSessionIdentifier();
    const userIdKey = `current_user_id_${sessionId}`;
    sessionStorage.setItem(userIdKey, userId);
}

// 删除当前用户ID
function removeCurrentUserId() {
    const sessionId = getSessionIdentifier();
    const userIdKey = `current_user_id_${sessionId}`;
    sessionStorage.removeItem(userIdKey);
}

//defineStore为一个函数，第一个参数为store的名字，第二个参数为store的选项,返回一个函数给useuserstore使用
//useuserstore为一个函数，返回一个对象，对象中包含state和actions属性
//user属性是一个ref，用来存储用户信息
//meta属性是一个对象，用来存储一些状态信息，比如是否登录
export const useUserStore = defineStore('user', {
    state:()=>({
        user: ref<User | null>(null),
        meta:{
            islogin: ref<boolean>(false),
            token: ref<string|null>(null)
        }
    }),
    getters:{
        islogin(state){
            return state.meta.islogin
        },
    },
    actions:{
        init(){//初始化用户信息，从本地存储中获取
            // 首先尝试从sessionStorage获取当前用户ID
            const storedUserId = getStoredUserId();
            
            let userKey = getStorageKey('user');
            let metaKey = getStorageKey('meta');
            
            // 如果有存储的用户ID，使用包含用户ID的键
            if (storedUserId) {
                userKey = getStorageKey('user', storedUserId);
                metaKey = getStorageKey('meta', storedUserId);
            }
            
            const storedUser = localStorage.getItem(userKey);
            
            if (storedUser) {
                this.user = JSON.parse(storedUser);
                this.meta = JSON.parse(localStorage.getItem(metaKey) || '{}');
                
                if (this.user && this.meta.token) {
                    console.log('User data found in local storage for specific user and session');
                    // 存储用户ID到当前会话
                    if (this.user.id) {
                        storeCurrentUserId(this.user.id.toString());
                    }
                    this.checkToken();
                    // 更新存储
                    localStorage.setItem(userKey, JSON.stringify(this.user));
                    localStorage.setItem(metaKey, JSON.stringify(this.meta));
                } else {
                    this.meta.islogin = false;
                    console.log('No valid token found in local storage');
                }
            } else {
                this.user = null;
                this.meta.islogin = false;
                console.log('No user data found in local storage for current session');
            }
        },
        async checkToken(){
            const res=await fetch(TokenUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.meta.token}`,
                    'Content-Type': 'application/json'
                },
            })
            const data=await res.json()
            if(data.code===200){
                console.log('Token is valid')
                this.meta.islogin=true
                this.user=data.data
            }else{
                console.log('Token is invalid')
                this.meta.islogin=false
            }
        },
        async Login(card:{email:string,password:string}){
            const res=await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(card)// 发送的数据object to json字符串
            })
            const data=await res.json()// 返回的数据 json to object
            if(data.code===200){
                this.user=data.data.user
                this.meta.token=data.data.token
                console.log("token getted successfully:",this.meta.token)
                this.meta.islogin=true
                
                // 使用基于用户ID和会话的存储键
                if (this.user && this.user.id) {
                    const userId = this.user.id;
                    // 存储用户ID到当前会话
                    storeCurrentUserId(userId.toString());
                    // 使用包含用户ID的存储键
                    const userKey = getStorageKey('user', userId.toString());
                    const metaKey = getStorageKey('meta', userId.toString());
                    
                    localStorage.setItem(userKey, JSON.stringify(this.user));
                    localStorage.setItem(metaKey, JSON.stringify(this.meta));
                    console.log(`User data stored with keys: ${userKey}, ${metaKey}`);
                } else {
                    // 如果没有用户ID，使用会话ID的存储键
                    const userKey = getStorageKey('user');
                    const metaKey = getStorageKey('meta');
                    
                    localStorage.setItem(userKey, JSON.stringify(this.user));
                    localStorage.setItem(metaKey, JSON.stringify(this.meta));
                    console.log(`User data stored with session-only keys: ${userKey}, ${metaKey}`);
                }
            }else{
                alert(data.msg)
            }
        },
        async Logout(){
            // 保存用户ID用于清除特定用户数据
            const currentUserId = getStoredUserId();
            
            // 清除用户状态
            this.user=null
            this.meta.islogin=false
            
            // 清除会话中的用户ID
            removeCurrentUserId();
            
            // 清除相应的localStorage数据
            if (currentUserId) {
                // 清除包含用户ID的存储数据
                const userKey = getStorageKey('user', currentUserId);
                const metaKey = getStorageKey('meta', currentUserId);
                
                localStorage.removeItem(userKey);
                localStorage.removeItem(metaKey);
                console.log(`User specific data cleared: ${userKey}, ${metaKey}`);
            }
            
            // 清除可能的会话级存储数据（以防万一）
            const sessionUserKey = getStorageKey('user');
            const sessionMetaKey = getStorageKey('meta');
            
            localStorage.removeItem(sessionUserKey);
            localStorage.removeItem(sessionMetaKey);
            console.log(`Session data cleared: ${sessionUserKey}, ${sessionMetaKey}`);
            console.log('User logged out and all related data cleared');
        }
    }
}
)