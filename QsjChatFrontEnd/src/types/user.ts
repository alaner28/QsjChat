export interface User {
  username: string;
  age: number;
  sex: string;
  id: number;
  password: string;
  email: string;
  imgUrl: string|undefined;
  createTime: string;
  updateTime?: string;
}


export interface otherUser {
  name: string;
  age: number;
  sex: string;
  id: number;
  email: string;
  imgUrl: string|undefined;
}