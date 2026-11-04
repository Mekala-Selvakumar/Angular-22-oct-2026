import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-product-detail',
  styleUrl: './product-detail.css',
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  private router=inject(Router);
  //  :id from the URL is passed to this component as an input property
  // :id  from the URL , bound by withComponentInputBinding()
  id=input.required<string>();
  next(){
    this.router.navigate(['/products',Number(this.id())+1])
  }
}
