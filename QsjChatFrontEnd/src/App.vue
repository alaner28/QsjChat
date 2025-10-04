<template> 
        <router-view></router-view>
</template>
<script lang = "ts" setup>
    import { ref ,onMounted } from 'vue'
    import { useUserStore } from './store/userStore'
    import { RouterView } from 'vue-router'
    const userStore = useUserStore()
    const loginsuccess = ref(false)
    //测试用
    onMounted(()=>{
        if(userStore.islogin&&userStore.user&&userStore.meta.token!==null){
            console.log("login success:",userStore.user)
            loginsuccess.value=true
        }else{
            console.log('not login')
        }
    })
</script>
<style scoped>
    
</style>