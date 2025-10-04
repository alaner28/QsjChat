import { defineStore } from 'pinia'
import { type Chatroom } from '../types/chatroom.ts'
import { type Message } from '../types/message.ts'
import { type otherUser } from '../types/user.ts'
import { getChatroomUrl, totalUrl } from '@/static.ts'
import { useUserStore } from './userStore.ts'
import { fetchImgById } from '@/util/fetchImgById.ts'
import { fetchOtherUserInfo } from '@/util/fetchOtherUserInfo.ts'

export const useChatroomStore = defineStore('chatroom', {
  state: () => ({
    userstore: useUserStore(), // 依赖于userStore
    chatrooms: new Map<string, Chatroom>(), // 存储多个聊天室的状态
    currentChatroomId: '' as string,// 当前聊天室的id
    currentLastMessage: '' as string, // 当前聊天室的最后一条消息
  }),
  
  actions: {
    // 获取当前用户的存储键名
    getUserStorageKey() {
      const userId = this.userstore.user?.id || 'guest';
      return `chatrooms_${userId}`;
    },
    
    init(){
      //this.userstore.init()
      const userStorageKey = this.getUserStorageKey();
      const storedChatrooms = localStorage.getItem(userStorageKey)
      console.log("storedChatrooms:",storedChatrooms)
      if (storedChatrooms) {
        try {
            // 尝试解析
            const parsed = JSON.parse(storedChatrooms);
            // 检查解析后的数据是否为数组
            if (Array.isArray(parsed)) {
                parsed.forEach(chatroom => {
                    // 将数组元素添加到Map中
                    this.chatrooms.set(chatroom.chatroomId, chatroom);
                });
            } else {
                console.error('Stored chatrooms is not an array:', parsed);
            }
        } catch(e) {
            console.error('Failed to parse stored chatrooms:', e);
        }
      }
      else {
        console.log('No chatroom data found in local storage')
      }
      //this.getChatrooms(this.userstore.user?.updateTime)
    },
    
    async getChatroom(chatroomId: string) {
      //在本地存储中查找聊天室
      const room = this.findChatroom(chatroomId)
      if (room) {
          return room
      } 
      else {
        //向后端请求聊天室信息
        const chatroom = await this.fetchChatroom(chatroomId)
        if(chatroom) {
          const membersResponse = await this.fetchChatroomMembers(chatroomId)
          // 处理从API返回的对象数据
          if (membersResponse && membersResponse.data) {
            chatroom.members = membersResponse.data
          } else {
            chatroom.members = [] // 确保members始终是一个数组
          }
          if(chatroom.img==""&&chatroom.type=="friend") {
            // 使用另一个成员的头像作为chatroom头像
            if(chatroom.members[0]!==this.userstore.user?.id){
              chatroom.img=await fetchImgById(chatroom.members[0])
            }
            else {
              chatroom.img=await fetchImgById(chatroom.members[1])
            }
          }
          //更新好友聊天名字为对方名字
          if(chatroom.type=="friend"){
            // 查找不是当前用户的另一个成员
            const otherMemberId = chatroom.members[0]!==this.userstore.user?.id?chatroom.members[0]:chatroom.members[1]
            if (otherMemberId) {
              // 获取其他用户的信息
              const otherUser:any = await fetchOtherUserInfo(otherMemberId);
              console.log("otherdata:",otherUser)
              if (otherUser) {
                chatroom.chatroomName = otherUser.name;
              }
            }
          }
          this.addChatroom(chatroom)
          //更新本地存储
          this.saveToLocalStorage()
          return chatroom
        }
        else return null
      }
    },
    async fetchChatroom(chatroomId: string) {
      try {
        const response = await fetch(`${getChatroomUrl}?chatroomId=${chatroomId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.userstore.meta.token}`
          }
        })
        if(response.ok) {
          const data = await response.json()  // 添加 await 来解析 Promise
          console.log("response:",data)
          return data.data  // 从响应中提取实际的聊天室数据
        }
        else {
          console.error("获取聊天室失败")
          return null
        }
      }
      catch(error) {
        console.error("网络错误:", error)
        return null
      }
    },
    //获取聊天室成员数组
    async fetchChatroomMembers(chatroomId:string){
      try{
        const response = await fetch(totalUrl+"/api/chatroom/getChatroomMembers?chatroomId="+chatroomId)
        if (response.ok){
          const data = await response.json()
          return data.data
        }
        else console.error("获取聊天室失败")
      }catch(error){
        console.error("网络错误:", error)
        return null
      }
    },
    async acceptMessage(message: Message) {
      let chatroom:any = this.findChatroom(message.chatroomId)
      if (chatroom) {
        chatroom.lastMessage = message.content
        chatroom.lastMessageTime = message.time
        chatroom.unreadCount = chatroom.unreadCount + 1
        this.chatrooms.set(chatroom.chatroomId, chatroom)// 更新聊天室状态
        this.saveToLocalStorage()
      }
      else {
        //向后端请求聊天室信息
        chatroom = await this.getChatroom(message.chatroomId)
        if (chatroom) {
          chatroom.lastMessage = message.content
          chatroom.lastMessageTime = message.time
          chatroom.unreadCount = chatroom.unreadCount + 1
          this.chatrooms.set(chatroom.chatroomId, chatroom)// 更新聊天室状态
          this.saveToLocalStorage()
        }
      }
    },
    
    addChatroom(chatroom: Chatroom) {
      this.chatrooms.set(chatroom.chatroomId, chatroom)
      this.saveToLocalStorage()
    },
    
    removeChatroom(chatroomId: string) {
      this.chatrooms.delete(chatroomId)
      this.saveToLocalStorage()
    },
    
    setCurrentChatroom(chatroomId: string) {
      this.currentChatroomId = chatroomId
    },
    
    findChatroom(chatroomId: string) {
      const chatroom = this.chatrooms.get(chatroomId)
      if(chatroom) return chatroom
      else return null
    },
    
    // 保存聊天室数据到localStorage（按用户分别存储）
    saveToLocalStorage() {
      const userStorageKey = this.getUserStorageKey();
      localStorage.setItem(userStorageKey, JSON.stringify(Array.from(this.chatrooms.values())))
    },
    
    // 清除当前用户的聊天室数据
    clearUserChatrooms() {
      const userStorageKey = this.getUserStorageKey();
      localStorage.removeItem(userStorageKey);
      this.chatrooms.clear();
    }
  },
})
    
    
    
    
