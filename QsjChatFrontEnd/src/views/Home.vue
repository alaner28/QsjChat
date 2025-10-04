<template>
    <div class="container">
        <RouterLink to="/profile" class="img">个人</RouterLink>
        <RouterLink to="/connect" class="module">联系</RouterLink>
        <RouterLink to="/friends" class="module">朋友</RouterLink>
        <RouterLink to="/files" class="module">文件</RouterLink>
        <div 
            class="others" 
            ref="settingsButton"
            @click="toggleSettingsMenu($event)"
        >
        设置
        </div>
        <div 
            v-if="showSettingsMenu"
            class="settings-menu"
            ref="settingsMenu"
        >
            <div class="menu-item" @click="logout">退出登录</div>
            <div class="menu-item" @click="clearCache">清除缓存</div>
            <div class="menu-item">通知设置</div>
        </div>
    </div>
    <router-view ></router-view>
    
    
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import { useUserStore } from '@/store/userStore';
    import { onMounted, onUnmounted } from 'vue'
    import { useRouter } from 'vue-router'
    const router = useRouter()
    const userStore = useUserStore();
    const showSettingsMenu = ref(false)
    const settingsButton = ref<HTMLElement | null>(null)

    // 切换设置菜单显示状态
    const toggleSettingsMenu = (event: MouseEvent) => {
        event.stopPropagation()
        showSettingsMenu.value = !showSettingsMenu.value
    }

    // 点击页面其他地方关闭菜单
    const closeMenuOnClickOutside = (event: MouseEvent) => {
    if (showSettingsMenu.value && settingsButton.value) {
        const target = event.target as HTMLElement
        if (!settingsButton.value.contains(target)) {
            showSettingsMenu.value = false
        }
    }
    }
    const logout = () => {
        userStore.Logout()
        router.push('/login')
        showSettingsMenu.value = false
    }
    
    // 清除缓存功能
    const clearCache = () => {
        try {
            // 清除localStorage
            localStorage.clear();
            
            // 清除sessionStorage
            sessionStorage.clear();
            
            // 重新加载页面以应用更改
            window.location.reload();
            
            console.log('缓存已清除');
        } catch (error) {
            console.error('清除缓存时出错:', error);
            alert('清除缓存时出现错误，请手动刷新页面');
        }
        
        // 关闭设置菜单
        showSettingsMenu.value = false;
    }
    
    onMounted(() => {
        document.addEventListener('click', closeMenuOnClickOutside)
    })
    onUnmounted(() => {
        document.removeEventListener('click', closeMenuOnClickOutside)
    })

</script>
<style scoped>
    .home {
        display: flex;
        height: 100%;
        width: 100%;
    }
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 6%;
        background-color: var(--level-1-bg);
        text-align: center;
        position: relative;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }
    .img {
        margin: 15px;
        margin-top: 25%;
        color: var(--level-1-text);
        font-size: 16px;
        font-weight: 500;
        padding: 12px 8px;
        border-radius: 8px;
        transition: all 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 40px;
    }
    .module {
        margin: 15px;
        color: var(--level-1-text);
        font-size: 16px;
        font-weight: 500;
        padding: 12px 8px;
        border-radius: 8px;
        transition: all 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 40px;
    }
    .others {
        margin-bottom: 20px;
        margin-top: auto;
        padding: 12px 8px;
        color: var(--level-1-text);
        font-size: 16px;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.2s ease;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 40px;
    }
    .img:hover, .module:hover, .others:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
    }
    .module.router-link-active {
        background-color: var(--primary-color);
        color: white;
    }
    /* 设置菜单样式 - 固定在设置按钮右侧 */
    .settings-menu {
        position: absolute;
        left: 100%; /* 紧靠按钮右侧 */
        bottom: -25px;   /* 垂直居中 */
        transform: translateY(-50%); /* 精确居中 */
        background-color: #2c2c2c;
        border: 1px solid #444;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        min-width: 100px;
    }

    .menu-item {
        padding: 10px 15px;
        color: #d8d8d8;
        cursor: pointer;
        text-align: left;
        transition: background-color 0.2s;
    }

    .menu-item:hover {
        background-color: #3a3a3a;
    }

    .menu-item:first-child {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .menu-item:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
</style>