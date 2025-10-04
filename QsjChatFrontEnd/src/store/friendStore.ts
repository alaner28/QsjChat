import { defineStore } from 'pinia'
import { type otherUser } from '@/types/user'
import { useUserStore } from './userStore'
import { totalUrl } from '@/static'
import { useChatroomStore } from './chatroomStore'
import { fetchOtherUserInfo } from '@/util/fetchOtherUserInfo'
export const useFriendStore = defineStore('friend', {
  state: () => ({
        friends: new Array<otherUser>(),
        currentuserid: useUserStore().user?.id,
        chatroomstore: useChatroomStore()
  }),
  actions: {
    async init(){
        await this.getFriends()
        /*const storedFriends=localStorage.getItem('friends')
        if(storedFriends){
            this.friends=JSON.parse(storedFriends)
            console.log('Friends data found in local storage')
        }else{
            console.log('No friends data found in local storage')
        }*/
        
    },
    removeFriend(friend: otherUser) {
        //通过 filter 方法筛选出所有 id 不等于 friend.id 的 otherUser 对象，并将这些对象重新赋值给 friends 数组。
        this.friends = this.friends.filter((f) => f.id !== friend.id)
    },
    async addFriend(friendid: number) {
      //TODO: 异步添加好友
      const res=await fetch(totalUrl+'/api/auth/addfriend',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userIds: [this.currentuserid, friendid]
            })
      })
      const data=await res.json()
      if(data.code===200){
        console.log('添加好友成功')
        const friendinfo=await fetchOtherUserInfo(friendid)
        this.chatroomstore.addChatroom(data.data.chatroom)
        this.friends.push(friendinfo)
        localStorage.setItem('chatrooms',JSON.stringify(this.chatroomstore.chatrooms))
        localStorage.setItem('friends',JSON.stringify(this.friends))
      }else{
        console.log('添加好友失败')
        console.log(data.msg)
      }
    },
    async getFriends(){
      //TODO: 获取好友列表
      const res=await fetch(totalUrl+`/api/auth/getfriends?id=${this.currentuserid}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
      })
      const data=await res.json()
      if(data.code===200){
        console.log('获取好友列表成功')
        this.friends=data.data
        console.log(data.data)
        console.log(this.friends)
      }else{
        console.log('获取好友列表失败')
      }
    }
  },
})