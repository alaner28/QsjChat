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
        <div class="friend-add">
            <button @click="addfriend">添加好友</button>
        </div>
    </div>

</template>
<script lang="ts" setup>
    import { ref, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import type { otherUser } from '@/types/user'
    import { useFriendStore } from '@/store/friendStore'
    import { totalUrl, defaultAvatar } from '@/static'
    const fuser = ref<otherUser>(getInitialUser())
    const friendStore = useFriendStore()
    const route = useRoute()
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
    async function addfriend() {
        friendStore.addFriend(fuser.value.id)
    }


</script>
<style scoped>  
    .profile-header {
        margin-left:25%;
        margin-top: 4%;
        background-color: #fff;
        padding: 30px 20px 20px;
        border-bottom: 1px solid #eee;
    }  
    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        margin-right: 20px;
    }
    
    .base-info {
        display: flex;
        align-items: flex-start; 
        margin-bottom: 20px;
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