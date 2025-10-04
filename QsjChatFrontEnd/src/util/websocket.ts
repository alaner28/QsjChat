import {webSocketUrl} from "@/static";
import {messageHandler} from "@/util/message";
import { type Message} from "@/types/message";
import { useUserStore } from "@/store/userStore";
let ws: WebSocket | null = null;
let timer: number | null = null;
let isReconnecting = false;
let reconnectCount = 0;

export function setupWebSocket() {
  ws = new WebSocket(webSocketUrl+`?userid=${useUserStore().user?.id}&username=${useUserStore().user?.username}`);
  ws.onopen = onWebSocketopen;
  ws.onmessage = onWebSocketMessage;
  ws.onclose = onWebSocketclose;
  ws.onerror = onWebSocketerror;
  return ws;
}
export function onWebSocketopen(event: Event) {
  console.log("WebSocket opened");
  isReconnecting = false;
  reconnectCount = 0;
}
//close
export function closeWebSocket() {
    if (ws) {
        ws.close();
    }
    if (timer) {
        clearTimeout(timer);
    }
    isReconnecting = false;
    reconnectCount = 0;
    console.log("WebSocket closed");
}
//reconnect
export function onWebSocketclose(event: CloseEvent) {
  console.log("WebSocket closed");
  if (!isReconnecting) {
    isReconnecting = true;
    reconnectCount++;
    console.log(`Reconnecting...(${reconnectCount})`);
    timer = setTimeout(() => {//每5秒尝试重新连接一次
      setupWebSocket();
    }, 5000);
  }
}
export function onWebSocketerror(event: Event) {
  console.log("WebSocket error");
}

//getMessage
export function onWebSocketMessage(event: MessageEvent) {
  console.log("Received message:", event.data);
  const message = JSON.parse(event.data) as Message;
  // handle message
  messageHandler(message);
}
//sendMessage
export function sendMessage(message: Message) {
  console.log("Sending message:", message);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.log("WebSocket not ready");
    alert("请检查网络连接，发送失败");
  }
}
