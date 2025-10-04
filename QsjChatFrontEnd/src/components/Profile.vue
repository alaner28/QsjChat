<template>
    <div class="profile-container">
        <!-- 个人信息头部 -->
        <div class="profile-header">
            <div class="avatar-container">
                <img 
                    :src="pendingAvatarFile ? previewUrl : (userStore.user?.imgUrl ? `${totalUrl}/api/download/file?filename=${userStore.user?.imgUrl}` : defaultAvatar)" 
                    alt="用户头像" 
                    class="avatar"
                    @click="showAvatar"
                >
                <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    style="display: none;"
                    @change="handleAvatarUpload"
                >
                <button 
                    class="change-avatar-btn" 
                    @click="triggerAvatarUpload"
                    v-if="isEditing"
                >
                    更换头像
                </button>
            </div>
            <div class="profile-info-header">
                <h2 class="username">{{ userStore.user?.username }}</h2>
                <button 
                    class="edit-btn"
                    @click="toggleEdit"
                    :class="{ 'save-btn': isEditing }"
                >
                    {{ isEditing ? '保存' : '编辑资料' }}
                </button>
            </div>
             <!-- 编辑模式下的取消按钮 -->
            <div v-if="isEditing" class="edit-actions">
                <button class="cancel-btn" @click="cancelEdit">取消</button>
            </div>
        </div>
        
        <!-- 个人信息内容 -->
        <div class="profile-content">
            <div class="info-item">
                <label>用户名：</label>
                <span v-if="!isEditing">{{ userStore.user?.username }}</span>
                <input 
                    v-else 
                    v-model="editForm.username" 
                    type="text" 
                    class="edit-input"
                    placeholder="请输入用户名"
                >
            </div>
            <div class="info-item">
                <label>ID：</label>
                <span>{{ userStore.user?.id }}</span>
            </div>
            <div class="info-item">
                <label>邮箱：</label>
                <span v-if="!isEditing">{{ userStore.user?.email }}</span>
                <input 
                    v-else 
                    v-model="editForm.email" 
                    type="email" 
                    class="edit-input"
                    placeholder="请输入邮箱"
                >
            </div>
            
            <div class="info-item">
                <label>年龄：</label>
                <span v-if="!isEditing">{{ userStore.user?.age }}</span>
                <input 
                    v-else 
                    v-model.number="editForm.age" 
                    type="number" 
                    class="edit-input"
                    placeholder="请输入年龄"
                    min="1"
                    max="120"
                >
            </div>
            
            <div class="info-item">
                <label>性别：</label>
                <span v-if="!isEditing">{{ userStore.user?.sex }}</span>
                <select 
                    v-else 
                    v-model="editForm.sex" 
                    class="edit-input"
                >
                    <option value="男">男</option>
                    <option value="女">女</option>
                    <option value="保密">保密</option>
                </select>
            </div>
            
            <div class="info-item">
                <label>注册时间：</label>
                <span>{{ formatDate(userStore.user?.createTime) }}</span>
            </div>
            
            <div class="info-item" v-if="userStore.user?.updateTime">
                <label>更新时间：</label>
                <span>{{ formatDate(userStore.user?.updateTime) }}</span>
            </div>
        </div>
        
       
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../store/userStore'
import { totalUrl } from '../static'

const userStore = useUserStore()
const isEditing = ref(false)
import { defaultAvatar } from '../static'

// 编辑表单数据
const editForm = ref({
  username: '',
  email: '',
  age: 0,
  sex: '男'
})

// 临时存储待上传的头像文件
const pendingAvatarFile = ref<File | null>(null)
// 头像预览URL
const previewUrl = ref<string>('')

// 初始化编辑表单数据
onMounted(() => {
  if (userStore.user) {
    editForm.value = {
      username: userStore.user.username || '',
      email: userStore.user.email || '',
      age: userStore.user.age || 0,
      sex: userStore.user.sex || '男'
    }
  }
})

// 组件卸载时清理预览URL
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

// 切换编辑模式
function toggleEdit() {
  if (isEditing.value) {
    saveProfile()
  } else {
    // 进入编辑模式前，重新加载当前用户数据
    if (userStore.user) {
      editForm.value = {
        username: userStore.user.username || '',
        email: userStore.user.email || '',
        age: userStore.user.age || 0,
        sex: userStore.user.sex || '男'
      }
    }
    isEditing.value = true
  }
}

// 取消编辑
function cancelEdit() {
  isEditing.value = false
  // 清理预览URL
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  pendingAvatarFile.value = null // 清除待上传的头像文件
  // 恢复表单数据
  if (userStore.user) {
    editForm.value = {
      username: userStore.user.username || '',
      email: userStore.user.email || '',
      age: userStore.user.age || 0,
      sex: userStore.user.sex || '男'
    }
  }
}

// 保存个人资料
async function saveProfile() {
  try {
    // 如果有待上传的头像文件，先上传头像
    let imgUrl: string | undefined | null = undefined
    if (pendingAvatarFile.value) {
      imgUrl = await uploadAvatar(pendingAvatarFile.value)
    }
    
    // 构建更新用户信息的API请求体
    const requestBody: any = {
      id: userStore.user?.id,
      username: editForm.value.username,
      email: editForm.value.email,
      age: editForm.value.age,
      sex: editForm.value.sex
    }
    
    // 只有在头像有变化时才添加imgUrl字段
    if (imgUrl !== undefined) {
      requestBody.imgUrl = imgUrl
    }
    
    const res = await fetch(`${totalUrl}/api/auth/changeUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.meta.token}`
      },
      body: JSON.stringify(requestBody)
    })
    
    const data = await res.json()
    
    if (data.code === 200) {
      // 更新成功，更新本地用户数据
      if (userStore.user) {
        userStore.user.username = editForm.value.username
        userStore.user.email = editForm.value.email
        userStore.user.age = editForm.value.age
        userStore.user.sex = editForm.value.sex
        if (imgUrl !== undefined && imgUrl !== null) {
          userStore.user.imgUrl = imgUrl
        }
        userStore.user.updateTime = new Date().toISOString()
        
        // 更新localStorage中的用户数据
        const userId = userStore.user.id.toString()
        const userKey = `user_user_${userId}_${sessionStorage.getItem('vueAppSessionId')}`
        localStorage.setItem(userKey, JSON.stringify(userStore.user))
      }
      
      alert('个人资料更新成功！')
      isEditing.value = false
      // 清理预览URL
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = ''
      }
      pendingAvatarFile.value = null // 清除待上传的头像文件
    } else {
      alert(`更新失败：${data.msg || '未知错误'}`)
    }
  } catch (error) {
    console.error('保存个人资料失败：', error)
    alert('保存失败，请检查网络连接')
  }
}

// 上传头像到服务器
async function uploadAvatar(file: File): Promise<string | null> {
  try {
    // 构建FormData
    const formData = new FormData()
    formData.append('avatar', file)
    formData.append('userId', userStore.user?.id.toString() || '')
    
    // 上传头像
    const res = await fetch(`${totalUrl}/api/auth/changeAvatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.meta.token}`
      },
      body: formData
    })
    
    const data = await res.json()
    
    if (data.code === 200 && data.data.imgUrl) {
      return data.data.imgUrl
    } else {
      throw new Error(data.msg || '头像上传失败')
    }
  } catch (error) {
    console.error('上传头像失败：', error)
    throw error
  }
}

// 格式化日期
function formatDate(dateString?: string) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 显示头像上传弹窗
function showAvatar() {
  
}

// 触发头像上传
function triggerAvatarUpload() {
  document.getElementById('avatar-upload')?.click()
}

// 处理头像上传（仅在编辑模式下选择文件，不立即上传）
function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    // 仅在编辑模式下保存待上传的文件
    if (isEditing.value) {
      pendingAvatarFile.value = file
      // 创建预览URL
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = URL.createObjectURL(file)
      alert('头像已选择，将在保存时上传')
    } else {
      alert('请先点击"编辑资料"再选择头像')
      // 清除文件输入
      input.value = ''
    }
  }
}
</script>
<style scoped>
/* 个人资料容器 */
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding-left: 8%;
  padding-right: 8%;
  padding-top: 4%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
  margin-bottom: 15px;
}

/* 个人资料头部 */
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

/* 头像容器 */
.avatar-container {
  position: relative;
  margin-right: 30px;
}

/* 头像 */
.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid #f0f0f0;
  transition: all 0.3s ease;
}

.avatar:hover {
  border-color: #1989fa;
  transform: scale(1.05);
}

/* 更换头像按钮 */
.change-avatar-btn {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  opacity: 0;
  visibility: hidden;
}

.avatar-container:hover .change-avatar-btn {
  opacity: 1;
  visibility: visible;
}

.change-avatar-btn:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

/* 个人信息头部 */
.profile-info-header {
  flex: 1;
}

/* 用户名 */
.username {
  margin: 0 0 15px 0;
  font-size: 24px;
  color: #333;
}

/* 编辑按钮 */
.edit-btn,
.save-btn,
.cancel-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #f0f0f0;
  color: #666;
}

.edit-btn:hover {
  background-color: #e0e0e0;
}

/* 保存按钮 */
.save-btn {
  background-color: #1989fa;
  color: white;
}

.save-btn:hover {
  background-color: #0066cc;
}

/* 取消按钮 */
.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
  margin-right: 10px;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

/* 个人信息内容 */
.profile-content {
  margin-bottom: 20px;
}

/* 信息项 */
.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

/* 标签 */
.info-item label {
  width: 100px;
  font-size: 14px;
  color: #999;
}

/* 内容 */
.info-item span {
  font-size: 14px;
  color: #333;
  flex: 1;
}

/* 编辑输入框 */
.edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.edit-input:focus {
  border-color: #1989fa;
  box-shadow: 0 0 0 2px rgba(25, 137, 250, 0.2);
}

/* 编辑操作按钮组 */
.edit-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    margin: 10px;
    padding: 15px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-item label {
    width: auto;
    margin-bottom: 5px;
  }
  
  .edit-input {
    width: 100%;
  }
}
</style>