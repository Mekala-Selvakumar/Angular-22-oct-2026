import { Service, signal } from '@angular/core';

export type UserRole = 'ADMIN' | 'USER';

export interface AppUser {
  username: string;
  role: UserRole;
}

@Service()
export class AuthService {
      private currentUser = signal<AppUser | null>(null);

  login(username: string, password: string): boolean {

    if (username === 'admin' && password === 'admin123') {

      this.currentUser.set({
        username: 'admin',
        role: 'ADMIN'
      });

      return true;
    }

    if (username === 'user' && password === 'user123') {

      this.currentUser.set({
        username: 'user',
        role: 'USER'
      });

      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): AppUser | null {
    return this.currentUser();
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

}
