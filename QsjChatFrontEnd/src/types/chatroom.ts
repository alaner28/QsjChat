import{ type Message} from './message'

export interface Chatroom {
  chatroomId: string;
  chatroomName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  leader?: number;
  members: number[];
  type: string;// group/friend
  img: string|undefined;
}