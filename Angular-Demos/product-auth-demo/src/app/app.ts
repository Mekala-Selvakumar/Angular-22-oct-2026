import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { MsalService } from '@azure/msal-angular';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('product-auth-demo');

  // authService = inject(AuthService);
  private authService = inject(MsalService);
  accountName = '';
  private router = inject(Router);

  ngOnInit(): void {

    this.authService
      .handleRedirectObservable()
      .subscribe({

        next: (result) => {
          const account = result?.account ??
            this.authService.instance.getActiveAccount() ??
            this.authService.instance.getAllAccounts()[0];

          if (account) {

            this.authService.instance
              .setActiveAccount(account);

            this.accountName =
              account.name ?? account.username;

          }

        },

        error: (error) => {

          console.error('MSAL redirect error', error);

        }

      });

  }

  login(): void {

    this.authService.loginRedirect({

      scopes: ['openid', 'profile']

    }).subscribe();

  }

    logout(): void {

    this.authService.logoutRedirect({

      postLogoutRedirectUri: 'http://localhost:4200/'

    }).subscribe();

  }


  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }

}
