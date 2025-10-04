export interface Message {
  chatroomId: string;
  messageId: string;
  senderId: number;
  content: string;
  time: string;
  type: string;// text/image/file
}