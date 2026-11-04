import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Post, Todo, User } from '../models/models';
import { map, Observable } from 'rxjs';

@Service()
export class ApiService {
private http=inject(HttpClient);
private baseUrl='https://jsonplaceholder.typicode.com';

getUsers():Observable<User[]>{
    return this.http.get<User[]>(`${this.baseUrl}/users`);
}

getUserById(id:number):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
}
getPostsByUserId(userId:number):Observable<Post[]>{
    return this.http.get<Post[]>(`${this.baseUrl}/posts?userId=${userId}`);
}
getTodosByUserId(userId:number):Observable<Todo[]>{
    return this.http.get<Todo[]>(`${this.baseUrl}/todos?userId=${userId}`);
}

//The fake API  has no search, so we filtr on the client.
// with a real API you would pass the search term ( as a query parameter) to the API and let it filter on the server.

searchUsersByName(name:string):Observable<User[]>{
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
        map(users=>users.filter(user=>user.name.toLowerCase().includes(name.toLowerCase())))
    );
}
}
