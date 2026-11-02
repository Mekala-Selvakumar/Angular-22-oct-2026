import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  imports: [FormsModule,JsonPipe],
  selector: 'app-login-demo',
  styleUrl: './login-demo.css',
  templateUrl: './login-demo.html',
})
export class LoginDemo {

    loginModel = {
    username: '',
    password: ''
  };

  login(form: NgForm) {
    if (form.valid) {
      console.log('Login Details:', this.loginModel);
      alert('Login successful!');
    }
  }
    // login() {
    //    console.log('Login Details:', this.loginModel);
    //   alert('Login successful!');
    // }
  }



