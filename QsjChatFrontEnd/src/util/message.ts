import{type Message} from "@/types/message"
import { useChatroomStore } from "@/store/chatroomStore"
import { useMessageStore } from "@/store/messageStore"
//import { useUserStore } from "@/store/userStore"

//消息处理
export const messageHandler = (message:Message ) => {
    useChatroomStore().acceptMessage(message)
    useMessageStore().addMessage(message)
}