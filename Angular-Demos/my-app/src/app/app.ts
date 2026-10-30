import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from './highlight.directive';
import { ProductCard } from './components/product-card/product-card';
import { Counter } from './components/counter/counter';
import { Demo } from './components/demo/demo';
 
@Component({
  imports: [RouterOutlet, NgClass, NgStyle, FormsModule, HighlightDirective, ProductCard, Counter, Demo],
  selector: 'app-root',
//   template:`
//   <input  type="text" value="Hi I am Angular" id="input1"   />
//    <input type="text" [value]="version"  [id]="myId" [disabled]="isDisabled"  />
//    <input type="text" bind-disabled="isDisabled" bind-value="version"  />
//    <br>
//    <img [src]="imagePath"  width="150px" height="150px"/>
//    <h1 class="text-success"> Welcome to My App - {{version}}</h1>
//    <h1 [class]="successClass"> Welcome to My App - {{version}}</h1>
//    <h1 [class]="hasError ? 'text-danger' : 'text-success'"> Welcome to My App - {{ title() }}</h1>
//  <h1 [class.text-danger]="hasError"> Welcome to My App - {{ title() }}</h1>

//    `,
  // styles:[
  //   `
  //   .text-success {
  //     color: green;
  //   }
  //   .text-danger {
  //     color: red;
  //   }
  //   .text-special {
  //     font-style: italic;
  //   }
    
  //   `

  // ],
   styleUrl: './app.css',
   templateUrl: './app.html',
  //  encapsulation:ViewEncapsulation.Emulated,
  changeDetection:ChangeDetectionStrategy.Eager
})
export class App {
  count=0
  increment(){
    this.count++;
  }
  message:string="";
  productName="Laptop";
  color="orange";
  username="Angular";
  hasError=false;
  successClass = "text-success";
  protected readonly title = signal('my-app');
  version="Angular 22"
  myId="testId"
  isDisabled=true;
  isSpecial=true;
  highlightColor="blue";
  imagePath="https://angular.io/assets/images/logos/angular/angular.svg"
  messageClasses={
    "text-success":!this.hasError,
    "text-danger":this.hasError,
    "text-special":this.isSpecial
  }
  titleStyles={
    color:"orange",
    fontStyle:"italic",
    fontSize:"40px"
  }
 greetings="Welcome";
  onClick(event:any){
    alert("Welcome to Angular");
    console.log("Welcome to Angular");
    console.log(event);
    alert(event.type);
  }

  buttonClickHandler(){
    alert("My Method Called");
    this.greetings="Welcome to Angular";

  }
  // logMessage(input:any){
  //   alert(input.value);
  //   this.greetings=input.value;
  //   console.log(input)
  // }
  logMessage(value:string){
    alert(value);
    this.greetings=value;
  }
}
