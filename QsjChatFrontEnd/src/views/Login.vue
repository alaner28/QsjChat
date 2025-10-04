<template> 
  <div>
    <h1>Login</h1>
    <form>
      <label for="Email">Email:</label>
      <input type="text" id="Email" v-model="email">
      <br>
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password">
      <br>
      <button type="submit" @click="handleSubmit">Login</button>
    </form>
    <label>don't have an account? <router-link to="/register" class="router-link" active-class="active">register</router-link></label>
  </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useUserStore} from '../store/userStore'
    const email = ref('')
    const password = ref('')
    const router = useRouter()//获取路由实例
    const userStore = useUserStore()//获取userStore实例
    async function handleSubmit(event: any) {
        event.preventDefault()//阻止默认提交事件
        if (!email.value || !password.value) {
            alert('Please input username and password')
            return
        }
        const card = {
            email: email.value,
            password: password.value
        }
        await userStore.Login(card)//调用userStore的Login方法,并传入card对象
        if(userStore.islogin){
            router.push('/')//跳转到首页,等效于template里的router-link标签
        }
    }
</script>
<style scoped>   
    h1 {
        text-align: center;
    }
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    input {
        margin: 10px;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }
    button {
        margin-top: 10px;
        padding: 5px 10px;
        border-radius: 5px;
        border: none; 
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    }
    button:hover {
        background-color: #3e8e41;
    }
    .router-link {
        color: #4CAF50;
        text-decoration: none;
    }
   .router-link.active {
        color: #3e8e41;
    }

</style>