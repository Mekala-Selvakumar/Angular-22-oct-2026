export interface User{
    id:number;
    name:string;
    email:string;

}
export interface Post{
    id:number;
    userId:number;
    title:string;
}
export interface Todo{
    id:number;
    userId:number;
    title:string;
    completed:boolean;
}