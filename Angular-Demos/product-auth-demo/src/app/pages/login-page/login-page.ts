import { Component, inject } from '@angular/core';
 import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
    private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private router = inject(Router);

  errorMessage = '';

  loginForm = this.fb.nonNullable.group({

    username: ['', Validators.required],

    password: ['', Validators.required]

  });

  login(): void {

    const { username, password } =
      this.loginForm.getRawValue();

    const success =
      this.authService.login(username, password);

    if (success) {

      this.router.navigate(['/products']);

    } else {

      this.errorMessage =
        'Invalid username or password';

    }

  }


}
