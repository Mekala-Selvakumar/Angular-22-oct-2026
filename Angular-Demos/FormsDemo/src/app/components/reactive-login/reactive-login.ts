import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-reactive-login',
  styleUrl: './reactive-login.css',
  templateUrl: './reactive-login.html',
})
export class ReactiveLogin {
formBuilder=inject(FormBuilder)

//  using FormGroup
// loginForm=new FormGroup({
//   username:new FormControl('',[Validators.required,Validators.minLength(3)]),
//      password:new FormControl('',[Validators.required,Validators.minLength(6)])
// })

loginForm=this.formBuilder.group({
  // username:new FormControl('',[Validators.required,Validators.minLength(3)]]),
    username:['',[Validators.required,Validators.minLength(3)]],
    password:['',[Validators.required,Validators.minLength(6)]]
})

login(){
  if (this.loginForm.invalid){
    this.loginForm.markAllAsTouched();
    return;
  }
  const loginValue=this.loginForm.getRawValue();
  alert(loginValue.username +" Login Successfully");



}
}
