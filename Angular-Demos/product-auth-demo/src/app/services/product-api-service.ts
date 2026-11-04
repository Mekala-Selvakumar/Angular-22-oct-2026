import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
 
@Service()
export class ProductApiService { 
     private http = inject(HttpClient);

  getProducts() :Observable<Product[]> {

    return this.http.get<Product[]>(
      'http://localhost:8082/api/products'
    );

  }


}
