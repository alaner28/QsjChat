/**
 * 上传文件到服务器
 * @param uploadUrl 上传接口URL
 * @param files 要上传的文件数组
 * @returns 服务器返回的数据
 */
export async function uploadFiles(uploadUrl: string, files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('file', file);
    });
    
    try {
        //上传文件
        console.log(`准备上传文件到: ${uploadUrl}`);
        files.forEach(file => {
            console.log(`文件名: ${file.name}, 大小: ${file.size}字节`);
        });

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
    }
}