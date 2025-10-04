import { defineStore } from 'pinia'
import { type Message } from '../types/message'
import { computed, reactive,ref, watch } from 'vue'

export const useMessageStore = defineStore('message', () => {
  // 使用 reactive Map 存储消息，key是聊天室ID，value是该聊天室的消息数组
  const messagesMap = reactive(new Map<string, Message[]>())
  
  // 当前正在处理的聊天室ID
  const currentRoomId = ref('')
  
  // 从本地存储加载消息数据
  function loadMessagesFromLocalStorage() {
    try {
      const saved = localStorage.getItem('chatMessages')
      if (saved) {
        const parsed = JSON.parse(saved)
        // 将对象转换回Map
        Object.entries(parsed).forEach(([roomId, messages]) => {
          messagesMap.set(roomId, messages as Message[])
        })
        console.log('Messages loaded from localStorage')
      }
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error)
    }
  }
  
  // 保存消息数据到本地存储
  function saveMessagesToLocalStorage() {
    try {
      // 将Map转换为对象以便JSON序列化
      const messagesObj: Record<string, Message[]> = {}
      messagesMap.forEach((messages, roomId) => {
        messagesObj[roomId] = messages
      })
      localStorage.setItem('chatMessages', JSON.stringify(messagesObj))
      console.log('Messages saved to localStorage')
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error)
    }
  }
  
  // 获取指定聊天室的消息数组
  const getRoomMessages = computed(() => (roomId: string) => {
    return messagesMap.get(roomId) || []
  })
  
  // 获取当前聊天室的消息数组
  const currentMessages = computed(() => {
    return messagesMap.get(currentRoomId.value) || []
  })
  
  // 添加消息到指定聊天室
  function addMessage(message: Message) {
    const messages = messagesMap.get(message.chatroomId) || []
    messages.push(message)
    messagesMap.set(message.chatroomId, messages)
    
    console.log(`Added message to room ${message.chatroomId}:`, message.content)
    console.log(messagesMap)
    
    // 保存到本地存储
    saveMessagesToLocalStorage()
  }
  
  // 批量添加消息到聊天室
  function addMessages(messages: Message[]) {
    const roomId = messages[0].chatroomId
    const existingMessages = messagesMap.get(roomId) || []
    const updatedMessages = [...existingMessages, ...messages]
    messagesMap.set(roomId, updatedMessages)
    
    console.log(`Added ${messages.length} messages to room ${roomId}`)
    
    // 保存到本地存储
    saveMessagesToLocalStorage()
  }
  
  // 切换到新的聊天室
  function setCurrentRoom(roomId: string) {
    currentRoomId.value = roomId
    console.log(`Current room set to: ${roomId}`)
  }
  
  // 清空指定聊天室的消息
  function clearRoomMessages(roomId: string) {
    messagesMap.set(roomId, [])
    console.log(`Cleared messages for room ${roomId}`)
    
    // 保存到本地存储
    saveMessagesToLocalStorage()
  }
  
  // 清空所有消息（可选功能）
  function clearAllMessages() {
    messagesMap.clear()
    console.log('Cleared all messages')
    
    // 保存到本地存储
    saveMessagesToLocalStorage()
  }
  
  
  
  // 监听messagesMap变化，自动保存到本地存储
  // 注意：这里只是补充保护，主要的保存逻辑应该在各个方法中
  watch(
    () => messagesMap,
    () => {
      // 使用防抖以避免频繁写入
      setTimeout(saveMessagesToLocalStorage, 300)
    },
    { deep: true }
  )
  
  // 初始化时加载本地存储数据
  loadMessagesFromLocalStorage()
  
  return {
    messagesMap,
    currentRoomId,
    currentMessages,
    getRoomMessages,
    addMessage,
    addMessages,
    setCurrentRoom,
    clearRoomMessages,
    clearAllMessages,
  }
})