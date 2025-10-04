import { type otherUser } from "@/types/user";
import { GetUserInfoUrl } from "@/static";
export async function fetchOtherUserInfo(id: number):Promise<otherUser>{
  const res=await fetch(`${GetUserInfoUrl}?id=${id}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const d=await res.json();
  const data=d.data;
  console.log(data);
  const otherUser: otherUser = {
    name: data.name,
    age: data.age,
    sex: data.sex,
    id: data.id,
    email: data.email,
    imgUrl: data.imgUrl,
  };
  return otherUser;
}