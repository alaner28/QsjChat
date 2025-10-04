<template>
    <div class="friends">
        <div class="search-container">
            <input type="text" placeholder="请输入好友id" v-model="inputValue" />
            <button @click="addFriend">
                搜索
            </button>
        </div>
        <ul class="friends-list">
            <li v-for="(friend, index) in friends" :key="index" class="friend" @click="showfriendinfo(friend)">
                <img :src="totalUrl + '/api/download/file?filename=' + friend.imgUrl" class="avatar"/>
                <div class="friend-name">{{ friend.name }}</div>
            </li>
        </ul>
    </div>
    <RouterView></RouterView>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import { type otherUser } from '@/types/user'
    import { fetchOtherUserInfo } from '@/util/fetchOtherUserInfo'
    import { useRouter } from 'vue-router'
    import { useFriendStore } from '@/store/friendStore'
    import { totalUrl } from '@/static'
    const friendStore = useFriendStore()
    const router = useRouter()
    const friends = friendStore.friends
    const inputValue = ref('')
    const searchedUser= ref<otherUser> ({
        name: '',
        age: 0,
        sex: '',
        id: 0,
        email: '',
        imgUrl: ''
    })
    async function addFriend() {
        try {
            const userInfo = await fetchOtherUserInfo(Number(inputValue.value))
            searchedUser.value = userInfo
            router.push({
                name: 'addfriends',
                query: {
                    id: searchedUser.value.id,
                    name: searchedUser.value.name,
                    imgUrl: searchedUser.value.imgUrl,
                    age: searchedUser.value.age,
                    sex: searchedUser.value.sex,
                    email: searchedUser.value.email
                }
            });
        } catch (error) {
            console.error('获取用户信息失败:', error)
        }
        console.log(searchedUser.value)
    }
    function showfriendinfo(friend: otherUser) {
        router.push({
            name: 'friendsdetails',
            query: {
                id: friend.id,
                name: friend.name,
                imgUrl: friend.imgUrl,
                age: friend.age,
                sex: friend.sex,
                email: friend.email
            }
        });
    }
</script>
<style scoped>
    .friends {
        height: 100%;
        width: 25%;
        background-color: var(--level-2-bg);
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
    }
    .search-container {
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
    }
    .search-container input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 12px;
        outline: none;
        transition: all 0.2s ease;
    }
    .search-container input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    .search-container button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .search-container button:hover {
        background-color: var(--primary-hover);
        transform: translateY(-1px);
    }
    .friends-list {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;
        flex: 1;
    }
    .friend {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        margin-bottom: 8px;
        border-radius: 8px;
        transition: all 0.2s ease;
        cursor: pointer;
        background-color: var(--bg-primary);
        border: 1px solid var(--border-color);
    }
    .friend:hover {
        background-color: var(--primary-light);
        border-color: var(--primary-color);
        transform: translateY(-1px);
    }
    .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 16px;
        object-fit: cover;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    }
    .friend-name {
        font-size: 15px;
        font-weight: 500;
        color: var(--text-primary);
    }
</style>