// 格式化时间
const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    })
}
// 截断长文本
const truncate = (text: string, maxLength: number) => {
    return text.length > maxLength 
        ? text.substring(0, maxLength) + '...' 
        : text
}
