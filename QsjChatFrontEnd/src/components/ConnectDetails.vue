<template>
    <div class="connect-details" style="background-color: var(--level-3-bg);">
        <ul class="message-list">
            <li v-for="message in messages" :key="message.messageId">
                <div v-if="message.senderId === userStore.user?.id" class="message-item my-message-container">
                    <div class="message-content-wrapper">
                        <div class="message-time">{{ formatTime(message.time) }}</div>
                        <div class="message-bubble mymessage" style="background-color: var(--primary-color); color: white;">
                            <!-- 文本消息 -->
                            <div v-if="message.type === 'text'" class="message-text">{{ parseContent(message.content).text}}</div>
                            <!-- 图片消息 -->
                            <div v-else-if="message.type === 'image'" class="message-image-container">
                                <img 
                                    :src="totalUrl+message.content" 
                                    alt="图片" 
                                    class="message-image"
                                    @click="previewImage(message.content)"
                                />
                            </div>
                            <!-- 文件消息 -->
                            <div v-else-if="message.type === 'file'" class="message-file-container" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color);">
                                <div class="file-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                </div>
                                <div class="file-info">
                                    <div class="file-name">{{ parseContent(message.content).name || getFileNameFromUrl(parseContent(message.content).url || message.content) }}</div>
                                    <div class="file-size">{{ parseContent(message.content).size || getFileSizeFromUrl(parseContent(message.content).url || message.content) }}</div>
                                </div>
                                <button 
                                    class="file-download-btn"
                                    @click="downloadFile(parseContent(message.content).url || message.content, parseContent(message.content).name || getFileNameFromUrl(parseContent(message.content).url || message.content))"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19,9H17V3H7V9H5L12,16L19,9Z"/>
                                        <path d="M21,15V17H3V15H21Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <img :src="userStore.user?.imgUrl ? totalUrl+'/api/download/file?fileName='+userStore.user?.imgUrl : defaultAvatar" alt="Avatar" class="message-avatar">
                </div>
                <div v-else class="message-item other-message-container">
                    <img :src="getSenderAvatar(message.senderId)" alt="Avatar" class="message-avatar">
                    <div class="message-content-wrapper">
                        <div class="message-time">{{ formatTime(message.time) }}</div>
                        <div class="message-bubble othermessage" style="background-color: var(--bg-tertiary); color: var(--text-primary);">
                            <!-- 文本消息 -->
                            <div v-if="message.type === 'text'" class="message-text">{{ parseContent(message.content).text}}</div>
                            <!-- 图片消息 -->
                            <div v-else-if="message.type === 'image'" class="message-image-container">
                                <img 
                                    :src="totalUrl+message.content" 
                                    alt="图片" 
                                    class="message-image"
                                    @click="previewImage(message.content)"
                                />
                            </div>
                            <!-- 文件消息 -->
                            <div v-else-if="message.type === 'file'" class="message-file-container">
                                <div class="file-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                </div>
                                <div class="file-info">
                                    <div class="file-name">{{ parseContent(message.content).name || getFileNameFromUrl(parseContent(message.content).url || message.content) }}</div>
                                    <div class="file-size">{{ parseContent(message.content).size || getFileSizeFromUrl(parseContent(message.content).url || message.content) }}</div>
                                </div>
                                <button 
                                    class="file-download-btn"
                                    @click="downloadFile(parseContent(message.content).url || message.content, parseContent(message.content).name || getFileNameFromUrl(parseContent(message.content).url || message.content))"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19,9H17V3H7V9H5L12,16L19,9Z"/>
                                        <path d="M21,15V17H3V15H21Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <!-- 工具栏 -->
        <div class="message-toolbar">
            <div class="toolbar-left">
                <button class="toolbar-btn" title="表情">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </button>
                <button class="toolbar-btn" title="图片">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                </button>
                <button class="toolbar-btn" title="文件">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                </button>
            </div>
            <div class="toolbar-right">
                <button class="toolbar-btn" title="更多">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </button>
            </div>
        </div>
        <!-- 输入区域 -->
        <div class="input-container">
            <input type="file" id="file-upload" style="display: none;" />
            <input type="file" id="image-upload" accept="image/*" style="display: none;" />
            <textarea 
                v-model="inputContent" 
                placeholder="请输入消息内容" 
                class="message-input" 
                rows="1"
                @input="autoResizeTextarea"
            ></textarea>
            <button 
                @click="sendMessage" 
                class="send-btn"
                :disabled="!inputContent.trim()"
            >
                发送
            </button>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { computed, onMounted, watch, ref, reactive } from 'vue'
    import { useRoute } from 'vue-router';
    import { useUserStore } from '@/store/userStore';
    import { type Message } from '@/types/message';
    import { totalUrl, defaultAvatar } from '@/static';
    import { fetchOtherUserInfo } from '@/util/fetchOtherUserInfo.ts';
    
    // 格式化时间函数
    function formatTime(timeString: string) {
        const date = new Date(timeString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        
        // 如果是今天的消息，只显示时间
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
        
        // 如果是昨天的消息
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
        
        // 其他情况显示完整日期和时间
        return date.toLocaleString('zh-CN', { 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    import { useChatroomStore } from '@/store/chatroomStore';
    import { useWebSocketStore } from '@/store/webSocketStore';
    import { useMessageStore } from '@/store/messageStore';
    const userStore = useUserStore();
    const route = useRoute();
    const chatroomStore = useChatroomStore();
    const messageStore = useMessageStore();
    
    // 从路由参数获取聊天室ID
    const chatroomId = ref(route.query.id as string || route.params.id as string);
    const chatroom = chatroomStore.findChatroom(chatroomId.value);
    const inputContent = ref('');
    
    // 自动调整文本区域高度
    function autoResizeTextarea() {
        const textarea = document.querySelector('.message-input') as HTMLTextAreaElement;
        if (textarea) {
            // 重置高度
            textarea.style.height = 'auto';
            // 设置新高度，不超过最大高度
            const newHeight = Math.min(textarea.scrollHeight, 120);
            textarea.style.height = `${newHeight}px`;
        }
    }
    
    // 监听工具栏的图片按钮点击事件，修改另一个---输入栏中隐藏的图片上传标签的内容。
    function handleImageClick() {
        const imageUpload = document.getElementById('image-upload') as HTMLInputElement;//获取图片上传按钮
        if (imageUpload) {
            imageUpload.click();
        }
    }
    
    // 点击文件按钮触发文件选择
    function handleFileClick() {
        const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
        if (fileUpload) {
            fileUpload.click();
        }
    }
    
    // 导入文件发送工具函数
    import { sendImageMessage, sendFileMessage } from '@/util/sendFileMessage';
    
    // 处理图片选择，监听change事件，一旦发现隐藏的input标签内容被修改，调用这个函数，实现文件上传
    async function handleImageSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (file) {
            console.log('选择的图片:', file.name);
            
            try {
                // 调用图片发送函数
                await sendImageMessage(file, chatroomId.value);
                console.log('图片发送成功');
            } catch (error) {
                console.error('图片发送失败:', error);
            } finally {
                // 清空input
                target.value = '';
            }
        }
    }
    
    // 处理文件选择
    async function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (file) {
            console.log('选择的文件:', file.name);
            
            try {
                // 调用文件发送函数
                await sendFileMessage(file, chatroomId.value);
                console.log('文件发送成功');
            } catch (error) {
                console.error('文件发送失败:', error);
            } finally {
                // 清空input
                target.value = '';
            }
        }
    }
    
    // 为图片和文件上传按钮添加点击事件监听
    onMounted(() => {
        console.log('current User:', userStore.user?.id);
        if (chatroomId.value) {
            messageStore.setCurrentRoom(chatroomId.value);
            // 初始加载后滚动到最新消息
            scrollToBottom();
        }
        
        // 添加按钮事件监听
        const imageBtn = document.querySelector('.toolbar-btn[title="图片"]');
        const fileBtn = document.querySelector('.toolbar-btn[title="文件"]');
        
        if (imageBtn) {
            imageBtn.addEventListener('click', handleImageClick);
        }
        
        if (fileBtn) {
            fileBtn.addEventListener('click', handleFileClick);
        }
        
        // 为文件输入添加change事件监听
        const imageUpload = document.getElementById('image-upload') as HTMLInputElement;
        const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
        
        if (imageUpload) {
            imageUpload.addEventListener('change', handleImageSelect);
        }
        
        if (fileUpload) {
            fileUpload.addEventListener('change', handleFileSelect);
        }
    });

    // 使用computed属性响应式获取当前聊天室的消息
    const messages = computed<Message[]>(() => {
        if (!chatroomId.value) {
            return [];
        }
        const roomMessages = messageStore.getRoomMessages(chatroomId.value);
        // 确保消息按时间排序
        return [...roomMessages].sort((a, b) => {
            const date1 = new Date(a.time);
            const date2 = new Date(b.time);
            return date1.getTime() - date2.getTime();
        });
    });

    // 在组件挂载时设置当前聊天室
    onMounted(() => {
        console.log('current User:', userStore.user?.id);
        if (chatroomId.value) {
            messageStore.setCurrentRoom(chatroomId.value);
            // 初始加载后滚动到最新消息
            scrollToBottom();
        }
    });

    // 监听聊天室ID变化，更新当前聊天室设置
    watch(chatroomId, (newId) => {
        if (newId) {
            messageStore.setCurrentRoom(newId);
            // 切换聊天室后滚动到最新消息
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
        // 清空头像缓存
        Object.keys(avatarCache).forEach(key => {
            delete avatarCache[Number(key)];
        });
    });

    // 监听消息变化，自动滚动到最新消息
    watch(messages, () => {
        scrollToBottom();
    }, { deep: true });

    // 滚动到消息列表底部的函数
    function scrollToBottom() {
        const messageList = document.querySelector('.message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }

    // 存储用户头像的缓存
    const avatarCache = reactive<Record<number, string>>({});

    // 获取发送者头像的函数
    async function fetchSenderAvatar(senderId: number) {
        // 检查缓存中是否已有头像
        if (avatarCache[senderId]) {
            return avatarCache[senderId];
        }
        
        // 如果是当前用户，直接返回用户头像
        if (senderId === userStore.user?.id) {
            const avatarUrl = userStore.user?.imgUrl ? totalUrl+'/api/download/file?fileName='+userStore.user?.imgUrl : defaultAvatar;
            avatarCache[senderId] = avatarUrl;
            return avatarUrl;
        }
        
        // 否则获取其他用户的头像
        try {
            const userInfo = await fetchOtherUserInfo(senderId);
            const avatarUrl = userInfo?.imgUrl ? totalUrl+'/api/download/file?fileName='+userInfo.imgUrl : defaultAvatar;
            avatarCache[senderId] = avatarUrl;
            return avatarUrl;
        } catch (error) {
            console.error('获取用户头像失败:', error);
            avatarCache[senderId] = defaultAvatar;
            return defaultAvatar;
        }
    }

    // 获取发送者头像URL的响应式函数
    function getSenderAvatar(senderId: number) {
        // 如果缓存中已有头像，直接返回
        if (avatarCache[senderId]) {
            return avatarCache[senderId];
        }
        
        // 否则异步获取头像
        fetchSenderAvatar(senderId);
        
        // 返回默认头像，直到获取到真实头像
        return defaultAvatar;
    }

    // 解析JSON格式的content字段
    function parseContent(content: string) {
        try {
            // 尝试解析JSON字符串
            return JSON.parse(content);
        } catch (error) {
            // 如果不是JSON格式，返回原始内容的包装对象
            return { text: content, url: content };
        }
    }

    // 预览图片（弹窗预览）
    function previewImage(imageUrl: string) {
        // 完整URL
        imageUrl = totalUrl+imageUrl;
        

        // 创建图片预览弹窗容器
        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview-overlay';
        previewContainer.id = 'image-preview-container';
        
        // 添加淡入动画
        setTimeout(() => {
            previewContainer.classList.add('fade-in');
        }, 10);
        
        // 创建预览内容容器
        const previewContent = document.createElement('div');
        previewContent.className = 'preview-content';
        
        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'preview-close-btn';
        closeButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            closePreview();
        });
        
        // 创建图片元素
        const previewImage = document.createElement('img');
        previewImage.src = imageUrl;
        previewImage.className = 'preview-image';
        previewImage.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
        });
        
        // 添加加载状态
        previewImage.style.opacity = '0';
        previewImage.onload = () => {
            // 图片加载完成后显示
            previewImage.style.opacity = '1';
        };
        
        // 创建图片信息区域
        const imageInfo = document.createElement('div');
        imageInfo.className = 'preview-info';
        const fileName = getFileNameFromUrl(imageUrl);
        imageInfo.textContent = fileName;
        
        // 组装预览内容
        previewContent.appendChild(closeButton);
        previewContent.appendChild(previewImage);
        previewContent.appendChild(imageInfo);
        previewContainer.appendChild(previewContent);
        document.body.appendChild(previewContainer);
        
        // 点击遮罩层关闭预览
        previewContainer.addEventListener('click', closePreview);
        
        // ESC键关闭预览
        function handleEscKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                closePreview();
            }
        }
        
        // 关闭预览函数
        function closePreview() {
            previewContainer.classList.remove('fade-in');
            previewContainer.classList.add('fade-out');
            
            // 等待动画完成后移除元素
            setTimeout(() => {
                document.body.removeChild(previewContainer);
                document.removeEventListener('keydown', handleEscKey);
            }, 300);
        }
        
        // 添加键盘事件监听
        document.addEventListener('keydown', handleEscKey);
    }
    
    // 下载文件（使用fetch API和Blob实现更可靠的文件下载）
    async function downloadFile(fileUrl: string, fileName: string) {
        try {
            fileUrl=totalUrl+fileUrl
            console.log('开始下载文件:', fileName, 'URL:', fileUrl);
            // 使用fetch API获取文件内容
            const response = await fetch(fileUrl, {
                method: 'GET',
                credentials: 'include' // 包含cookie，处理认证
            });
            
            // 检查响应状态
            if (!response.ok) {
                throw new Error(`下载文件失败: HTTP状态码 ${response.status}`);
            }
            
            // 获取文件内容
            const blob = await response.blob();
            console.log('文件下载成功，大小:', blob.size, '字节');
            
            // 创建Blob URL
            const blobUrl = URL.createObjectURL(blob);
            
            // 创建临时a标签并触发下载
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl); // 释放Blob URL资源
            }, 100);
            
            console.log('文件下载完成:', fileName);
        } catch (error) {
            console.error('文件下载过程中发生错误:', error);
            alert(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    
    // 从URL中提取文件名
    function getFileNameFromUrl(url: string): string {
        // 这里简化处理，实际项目中可能需要更复杂的逻辑来解析文件名
        const parts = url.split('/');
        const queryIndex = parts[parts.length - 1].indexOf('?');
        if (queryIndex > -1) {
            return parts[parts.length - 1].substring(0, queryIndex);
        }
        return parts[parts.length - 1] || '文件';
    }
    
    // 从URL中提取文件大小（实际项目中可能需要从服务器获取真实大小）
    function getFileSizeFromUrl(url: string): string {
        const extension = url.split('.').pop()?.toLowerCase() || '';
        const mockSizes = {
            'jpg': '1.2MB',
            'jpeg': '1.2MB',
            'png': '1.5MB',
            'gif': '2.0MB',
            'pdf': '3.5MB',
            'doc': '1.8MB',
            'docx': '2.2MB',
            'xls': '1.5MB',
            'xlsx': '2.5MB',
            'zip': '5.0MB',
            'rar': '4.5MB'
        };
        
        return mockSizes[extension as keyof typeof mockSizes] || '未知大小';
    }
    function sendMessage() {
        if(!userStore.user || !chatroomId.value){
            console.log('无法发送消息：用户未登录或聊天室ID无效');
            return
        }
        console.log('发送消息到聊天室ID:', chatroomId.value);
        const msg: Message = {
            chatroomId: chatroomId.value,
            messageId: '',
            senderId: userStore.user.id,
            content: JSON.stringify({ text: inputContent.value }), // 将文本消息也包装成JSON格式
            time: new Date().toISOString(),
            type: 'text',
        }
        useWebSocketStore().send(msg);
        // 发送后清空输入框
        inputContent.value = '';
    }


</script>
<style scoped>
    .connect-details {
        height: 100vh;
        width: 69%;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: #f5f5f5;
    }
    .message-list {
        list-style: none;
        margin: 0;
        padding: 10px;
        flex: 1;
        overflow-y: auto;
    }
    .message-item {
        width: 100%;
        margin-bottom: 15px;
        display: flex;
        align-items: flex-end;
    }
    .my-message-container {
        justify-content: flex-end !important;
    }
    .other-message-container {
        justify-content: flex-start !important;
    }
    .message-content-wrapper {
        display: flex;
        flex-direction: column;
        max-width: 70%;
    }
    .my-message-container .message-content-wrapper {
        align-items: flex-end !important;
        margin-right: 10px;
    }
    .other-message-container .message-content-wrapper {
        align-items: flex-start !important;
        margin-left: 10px;
    }
    .message-bubble {
        padding: 10px 15px;
        word-wrap: break-word;
        text-align: left;
        display: inline-block;
    }
    .mymessage {
        background-color: #90caf9;
        border-radius: 10px 10px 0 10px;
        float: right;
    }
    .othermessage {
        background-color: #fff;
        border-radius: 10px 10px 10px 0;
        float: left;
    }
    .message-time {
        font-size: 12px;
        color: #999;
        margin-bottom: 5px;
    }
    .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }
    .message-text {
        font-size: 16px;
        color: #333;
    }
    
    /* 图片消息样式 */
    .message-image-container {
        position: relative;
        display: inline-block;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
    }
    
    .message-image {
        max-width: 200px;
        max-height: 200px;
        border-radius: 8px;
        transition: transform 0.2s ease;
    }
    
    .message-image:hover {
        transform: scale(1.02);
    }
    
    /* 文件消息样式 */
    .message-file-container {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background-color: #f8f9fa;
        border-radius: 8px;
        min-width: 200px;
    }
    
    .file-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e3f2fd;
        color: #1976d2;
        border-radius: 4px;
        margin-right: 10px;
    }
    
    .file-info {
        flex: 1;
        min-width: 0;
    }
    
    .file-name {
        font-size: 14px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 2px;
    }
    
    .file-size {
        font-size: 12px;
        color: #999;
    }
    
    .file-download-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        color: #1976d2;
        cursor: pointer;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .file-download-btn:hover {
        background-color: #e3f2fd;
    }
    
    /* 图片预览样式 */
    .image-preview-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    /* 淡入动画 */
    .image-preview-overlay.fade-in {
        opacity: 1;
        visibility: visible;
    }
    
    /* 淡出动画 */
    .image-preview-overlay.fade-out {
        opacity: 0;
        visibility: hidden;
    }
    
    /* 预览内容容器 */
    .preview-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
    }
    
    /* 预览图片样式 */
    .preview-image {
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 8px;
        transition: opacity 0.3s ease;
        cursor: zoom-out;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    
    /* 关闭按钮样式 */
    .preview-close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.15);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 1001;
        backdrop-filter: blur(5px);
    }
    
    .preview-close-btn:hover {
        background-color: rgba(255, 255, 255, 0.25);
        transform: scale(1.1);
    }
    
    /* 图片信息样式 */
    .preview-info {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        backdrop-filter: blur(5px);
        transition: opacity 0.2s ease;
    }
    
    /* 响应式调整 */
    @media (max-width: 768px) {
        .preview-close-btn {
            width: 36px;
            height: 36px;
            top: 15px;
            right: 15px;
        }
        
        .preview-info {
            font-size: 12px;
            padding: 6px 12px;
            bottom: 20px;
        }
        
        .preview-image {
            max-height: 80vh;
        }
    }
    .message-toolbar {
        display: flex;
        justify-content: space-between;
        padding: 8px 15px;
        background-color: #f5f5f5;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        z-index: 10;
    }
    
    .toolbar-left, .toolbar-right {
        display: flex;
        align-items: center;
    }
    
    .toolbar-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: none;
        color: #666;
        cursor: pointer;
        border-radius: 50%;
        margin-right: 5px;
        transition: all 0.2s ease;
    }
    
    .toolbar-btn:hover {
        background-color: #e8e8e8;
        color: #333;
    }
    
    .input-container {
        display: flex;
        align-items: flex-end;
        padding: 10px 15px;
        background-color: white;
        z-index: 20;
    }
    
    .message-input {
        flex: 1;
        min-height: 40px;
        max-height: 120px;
        padding: 10px 15px;
        border: 1px solid #d9d9d9;
        border-radius: 20px;
        outline: none;
        font-size: 15px;
        line-height: 20px;
        resize: none;
        margin-right: 10px;
        font-family: inherit;
    }
    
    .message-input:focus {
        border-color: #1989fa;
    }
    
    .send-btn {
        padding: 10px 20px;
        background-color: #1989fa;
        color: white;
        border: none;
        border-radius: 20px;
        font-size: 15px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        white-space: nowrap;
    }
    
    .send-btn:hover:not(:disabled) {
        background-color: #0066cc;
    }
    
    .send-btn:disabled {
        background-color: #c0c4cc;
        cursor: not-allowed;
    }
</style>