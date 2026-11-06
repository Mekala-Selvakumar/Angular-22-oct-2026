import { Service, signal } from '@angular/core';

export type UserRole = 'ADMIN' | 'USER';

export interface AppUser {
  username: string;
  role: UserRole;
}

@Service()
export class Authservice {
    isLoggedIn =false

    
     checkLogin():boolean{
        return this.isLoggedIn
    }

          private currentUser = signal<AppUser | null>(null);

  login(username: string, password: string): boolean {

    if (username === 'admin' && password === 'admin123') {

      this.currentUser.set({
        username: 'admin',
        role: 'ADMIN'
      });
       this.isLoggedIn=true

      return true;
    }

    if (username === 'user' && password === 'user123') {

      this.currentUser.set({
        username: 'user',
        role: 'USER'
      });
    this.isLoggedIn=true

      return true;
    }

    return false;
  }

  logout(): void {
  this.isLoggedIn=false

    this.currentUser.set(null);
  }
}
