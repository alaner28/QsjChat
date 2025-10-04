import { totalUrl } from "@/static";

export async function fetchImgById(id:number) {
    try {
        const res = await fetch(totalUrl+"/api/getImgById?id="+id)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json()
        return data.data.data
    } catch (error) {
        console.error("获取图片失败:", error)
        return null; // 或者返回默认图片URL
    }
}