import { defineStore } from 'pinia'
import { sendMessage, setupWebSocket } from '@/util/websocket'
import { type Message } from '@/types/message'
import { useUserStore } from './userStore'
export const useWebSocketStore = defineStore('webSocketStore', {
  state: () => ({
    ws: null as WebSocket | null,
    message: '',
    isConnected: false,
    error: '',
  }),
  actions: {
    async connect() {
        try{
            this.ws=setupWebSocket()
        }catch (err: any) {
            this.error = err.message;
            this.isConnected = false;
        }
    },
    async send(message: Message) {
        sendMessage(message)
    }
  },
})