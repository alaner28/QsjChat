/**
 * 文件消息发送工具函数
 * 封装文件和图片的上传与发送逻辑
 */
import { useUserStore } from '@/store/userStore';
import { useWebSocketStore } from '@/store/webSocketStore';
import { type Message } from '@/types/message';
import { uploadFiles } from './uploadFiles';
import { totalUrl } from '@/static';
/**
 * 发送图片消息
 * @param file 要发送的图片文件
 * @param chatroomId 聊天室ID
 * @returns Promise<void>
 */
export async function sendImageMessage(file: File, chatroomId: string): Promise<void> {
    try {
        const userStore = useUserStore();
        
        // 检查用户是否登录和聊天室ID是否有效
        if (!userStore.user || !chatroomId) {
            console.error('无法发送图片：用户未登录或聊天室ID无效');
            return;
        }
        
        // 显示上传进度提示
        console.log(`开始上传图片: ${file.name}`);
        
        const uploadResult = await uploadFiles(totalUrl+'/api/upload/image', [file]);
        console.log('图片上传后端返回结果:', uploadResult);
        // 检查上传结果
        if (uploadResult.code === 200 && uploadResult.imageURL?.length > 0) {
            const imageUrl = uploadResult.imageURL;
            console.log(`图片上传成功，URL: ${imageUrl}`);
            
            // 构建图片消息对象
            const imageMessage: Message = {
                chatroomId: chatroomId,
                messageId: '',
                senderId: userStore.user.id,
                content: imageUrl,
                time: new Date().toISOString(),
                type: 'image'
            };
            
            // 使用WebSocket发送消息
            useWebSocketStore().send(imageMessage);
            
            console.log('图片消息发送成功');
        } else {
            throw new Error('图片上传失败: ' + (uploadResult || '未知错误'));
        }
    } catch (error) {
        console.error('发送图片消息失败:', error);
        throw error;
    }
}

/**
 * 发送文件消息
 * @param file 要发送的文件
 * @param chatroomId 聊天室ID
 * @returns Promise<void>
 */
export async function sendFileMessage(file: File, chatroomId: string): Promise<void> {
    try {
        const userStore = useUserStore();
        
        // 检查用户是否登录和聊天室ID是否有效
        if (!userStore.user || !chatroomId) {
            console.error('无法发送文件：用户未登录或聊天室ID无效');
            return;
        }
        
        // 显示上传进度提示
        console.log(`开始上传文件: ${file.name}, 大小: ${(file.size / 1024).toFixed(2)}KB`);
        
        // 调用文件上传函数
        const uploadResult = await uploadFiles(totalUrl+'/api/upload/file', [file]);
        console.log('文件上传后端返回结果:', uploadResult);
        // 检查上传结果
        if (uploadResult.code === 200 && uploadResult.fileURL?.length > 0) {
            const fileUrl = uploadResult.fileURL;
            console.log(`文件上传成功，URL: ${fileUrl}`);
            
            // 构建文件消息对象，content中包含文件名和URL等信息
            const fileContent = JSON.stringify({
                name: file.name,
                size: file.size,
                type: file.type,
                url: fileUrl
            });
            
            const fileMessage: Message = {
                chatroomId: chatroomId,
                messageId: '',
                senderId: userStore.user.id,
                content: fileContent,
                time: new Date().toISOString(),
                type: 'file'
            };
            
            // 使用WebSocket发送消息
            useWebSocketStore().send(fileMessage);
            
            console.log('文件消息发送成功');
        } else {
            throw new Error('文件上传失败: ' + (uploadResult.message || '未知错误'));
        }
    } catch (error) {
        console.error('发送文件消息失败:', error);
        throw error;
    }
}