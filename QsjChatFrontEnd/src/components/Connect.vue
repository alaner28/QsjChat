<template>
    <div class="chat-list">
        <li 
            v-for="chatroom in chatrooms" 
            :key="chatroom.chatroomId"
            class="chat" 
        >
            <RouterLink 
                :to="{
                    name: 'connectdetails',
                    query:{
                        id: chatroom.chatroomId,
                    }
                }"
                class="chat-link"
            >
                <!-- 头像 -->
                <div class="chat-avatar-container">
                    <img :src="`${totalUrl}/api/download/file?fileName=${chatroom.img}`" class="chat-avatar">
                </div>
                
                <!-- 内容区域 -->
                <div class="chat-content">
                    <div class="chat-header">
                        <div class="chat-name">{{ chatroom.chatroomName }}</div>
                        <div class="chat-time">{{ formatTime(chatroom.lastMessageTime) }}</div>
                    </div>
                    <div class="chat-message">{{ formatLastMessage(chatroom.lastMessage) }}</div>
                </div>
            </RouterLink>
        </li>
    </div>
    <router-view></router-view>
</template>
<script lang="ts" setup>
    import { ref, computed } from 'vue'
    import { type Chatroom } from '@/types/chatroom';
    import { useChatroomStore } from '@/store/chatroomStore';
    import { totalUrl } from '@/static';
    const chatroomstore= useChatroomStore()
    //map->array
    const chatrooms = ref<Chatroom[]>([])
    const iterator = chatroomstore.chatrooms.values()
    chatrooms.value = Array.from(iterator)

    // 选择聊天室
    const selectedRoom = ref<Chatroom | null>(null)
    const selectChatroom = (id: string) => {
        selectedRoom.value = chatrooms.value.find(room => room.chatroomId === id) || null
    }

    // 格式化时间 - 微信风格
    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        
        const date = new Date(timeString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // 今天的消息显示时间
        if (diffDays === 0) {
            return date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
        // 昨天的消息
        else if (diffDays === 1) {
            return '昨天';
        }
        // 今年的消息显示月日
        else if (date.getFullYear() === now.getFullYear()) {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
        // 其他显示完整日期
        else {
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        }
    }

    // 格式化最后一条消息
    const formatLastMessage = (message: string) => {
        if (!message) return '';
        // 可以根据消息类型添加对应的前缀，如[图片]、[文件]等
        return message;
    }
    console.log("chatrooms:",chatrooms.value)
</script>
<style scoped>
    .chat-list{
        list-style: none; 
        background-color: var(--level-2-bg);
        padding: 0; 
        margin: 0;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 25%;
        border-right: 1px solid var(--border-color);
    }
    
    .chat{
        list-style: none;
        margin: 0;
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        transition: all 0.2s ease;
        cursor: pointer;
    }
    
    .chat:hover {
        background-color: #f5f5f5;
    }
    
    .chat.router-link-active {
        background-color: #f0f7ff;
    }
    
    .chat-link {
        display: flex;
        align-items: flex-start;
        width: 100%;
        text-decoration: none;
    }
    
    /* 头像容器 */
    .chat-avatar-container {
        position: relative;
        margin-right: 12px;
    }
    
    /* 头像 */
    .chat-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        background-color: #f0f0f0;
    }
    
    /* 未读消息角标 */
    .unread-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        background-color: #ff4d4f;
        color: white;
        font-size: 10px;
        font-weight: bold;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
    }
    
    /* 内容区域 */
    .chat-content {
        flex: 1;
        min-width: 0;
    }
    
    /* 聊天头部：名称和时间 */
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 4px;
    }
    
    /* 聊天名称 */
    .chat-name {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    /* 聊天时间 */
    .chat-time {
        font-size: 12px;
        color: #999999;
        white-space: nowrap;
    }
    
    /* 最后一条消息 */
    .chat-message {
        font-size: 14px;
        color: #666666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.4;
    }
    
    /* 滚动条样式 */
    .chat-list::-webkit-scrollbar {
        width: 6px;
    }
    
    .chat-list::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    .chat-list::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }
    
    .chat-list::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

</style>