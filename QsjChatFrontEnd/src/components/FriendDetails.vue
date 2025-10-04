<template>
    <div class="profile-header">
        <div class="base-info">
            <img :src="fuser.imgUrl ? `${totalUrl}/api/download/file?fileName=${fuser.imgUrl}` : defaultAvatar" class="avatar"/>
            <div class="user-info">
                <div class="username">{{ fuser.name }}</div>
                <div class="id">ID:{{ fuser.id }}</div>
            </div>
        </div>
        
        <div class="info-list">
            <div class="info-item">Email: {{ fuser.email }}</div>
            <div class="info-item">性别: {{ fuser.sex }}</div>
            <div class="info-item">年龄: {{ fuser.age }}</div>
        </div>
        <button @click="chatroomhandle">发送消息</button>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import type { otherUser } from '@/types/user'
    import { useFriendStore } from '@/store/friendStore'
    import { useChatroomStore } from '@/store/chatroomStore'
    import { useUserStore } from '@/store/userStore'
    import { totalUrl, defaultAvatar } from '@/static'

    const fuser = ref<otherUser>(getInitialUser())
    const route = useRoute()
    const router = useRouter()

    watch(
        () => route.query,// 监听路由参数变化
        (newQuery) => {
            fuser.value = parseUserFromQuery(newQuery)
        },
        { deep: true, immediate: true }
    )

    // 工具函数：解析路由参数
    function parseUserFromQuery(query: any): otherUser {
        return {
            name: safeString(query.name),
            email: safeString(query.email),
            imgUrl: safeString(query.imgUrl),
            sex: safeString(query.sex),
            age: safeNumber(query.age),
            id: safeNumber(query.id)
        }
    }

    // 工具函数：安全转换字符串
    function safeString(value: any): string {
        return Array.isArray(value) ? value[0] || '' : value || ''
    }
    
    // 工具函数：安全转换数字
    function safeNumber(value: any): number {
        if (Array.isArray(value)) value = value[0]
        const num = Number(value)
        return isNaN(num) ? 0 : num
    }

    // 初始化
    function getInitialUser(): otherUser {
        return {
            name: '',
            email: '',
            imgUrl: '',
            sex: '',
            age: 0,
            id: 0
        }
    }
    
    //创建会话并跳转
    async function chatroomhandle() {
        const currentUser = useUserStore().user
        const smaller = Math.min(currentUser?.id || 0, fuser.value.id)
        const larger = Math.max(currentUser?.id || 0, fuser.value.id)
        const chatroomId = `fchatroom_user1_${smaller}_user2_${larger}`
        
        // 先尝试从本地存储获取聊天室
        let chatroom = await useChatroomStore().getChatroom(chatroomId)
        console.log("get chatroom success", chatroom)
        
        // 如果本地没有，则向后端请求聊天室信息
        if (!chatroom) {
            chatroom = await useChatroomStore().fetchChatroom(chatroomId)
        }
        
        // 跳转到聊天页面
        router.push(`/connect/connectdetails?id=${chatroomId}`)
    }
</script>

<style scoped>
    .profile-header {
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    
    .base-info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 20px;
    }
    
    .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
   
    .username {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
        display: block; 
    }
    
    .id {
        color: #888;
        font-size: 14px;
        display: block; 
    }
    
    .info-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start; 
    }
    
    .info-item {
        text-align: left; 
        margin-bottom: 10px;
    }
</style>