import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  private router=inject(Router);

  sort=input<string>('asc');
  private products =[
    {id:1,name:'Keyboard ',price:5000},
    {id:2,name:'Mouse ',price:2000},
    {id:3,name:'Monitor ',price:15000},
   ]
   sorted=computed(()=>
   [... this.products].sort((a, b) => 
      this.sort() === 'desc' ?b.name.localeCompare(a.name):a.name.localeCompare(b.name)
     ));

     setSort(sort:'asc'|'desc'){
      this.router.navigate([],{
        queryParams:{sort},
        queryParamsHandling:'merge'
      })
     }

   }

