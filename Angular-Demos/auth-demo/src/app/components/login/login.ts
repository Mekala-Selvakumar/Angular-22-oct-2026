import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authservice } from '../../services/authservice';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
 private fb = inject(FormBuilder);

  private authService = inject(Authservice);

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

      this.router.navigate(['/dashboard']);

    } else {

      this.errorMessage =
        'Invalid username or password';

    }

  }

}
