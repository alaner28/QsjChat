<template>
    <div>
        <h1>Register</h1>
        <form>
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username">
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password">
            <br>
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" v-model="confirmPassword">
            <br>
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email">
            <button type="button" @click="sendCode">send code</button>
            <br>
            <label for="code">Code:</label>
            <input type="code" id="code" v-model="code">
            <br>
            <button type="submit" @click="register">register</button>
        </form>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { sendemailUrl,registerUrl } from '@/static'
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const email = ref('')
    const code = ref('')
    const sendCode = () => {
        async function send() {
            console.log(email.value)
            const response = await fetch(sendemailUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email.value })
            })
            
            const data = await response.json()
            console.log(data)
        }
        send()
    }
    async function register() {
        if (password.value !== confirmPassword.value) {
            alert('两次输入的密码不一致')
            return
        }
        const response = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
                email: email.value,
                code: code.value
            })
        })
        const data = await response.json()
        console.log(data)
        if (data.success) {
            alert('注册成功')
            const router = useRouter()
            router.push('/login')
        } else {
            alert('注册失败')
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
    input[type="text"], input[type="password"] {
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
</style>