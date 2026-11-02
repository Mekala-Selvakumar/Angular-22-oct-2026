import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Product, ProductDraft } from '../models/product';

@Service()
export class HttpProductService {
    private http=inject(HttpClient)
    private apiUrl="http://localhost:3000/products";

    private readonly productState = signal<Product[]>([]);

    readonly products = this.productState.asReadonly();
    readonly totalProducts = computed(() => this.productState().length);
    readonly lowStockProducts = computed(() =>
        this.productState().filter(product => product.stockQuantity <= 5)
    );
    readonly totalInventoryValue = computed(() =>
        this.productState().reduce(
            (total, product) => total + product.price * product.stockQuantity,
            0
        )
    );

    // READ: retrieve all products
    // getAll(): Observable<Product[]> {
    //     return this.http.get<Product[]>(this.apiUrl).pipe(
    //         tap(products => this.productState.set(products))
    //     );
    // }
        getAll(): Observable<HttpResponse<Product[]>> {
        return this.http.get<Product[]>(this.apiUrl,
            {
                observe:"response"
            }
        ) 
    ;
    }

    // getAll(): Observable<Product[]>{
    //     return this.http.get<Product[]>(this.apiUrl)
    //     .pipe(
    //         catchError((error: HttpErrorResponse)=>{
    //             console.log('Status' , error.status)
    //             console.log('error message: ' ,error.message)
    //             return throwError(() =>{
    //                 new Error('Something went wrong while fetching products')
    //             })
    //         })
    //     );
 
    // }

    // READ: retrieve a single product
    getById(id: number): Observable<Product> {
        // http://localhost:300/products/101
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    // CREATE: add a new product
    create(product: ProductDraft): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product).pipe(
            tap(createdProduct =>
                this.productState.update(products => [...products, createdProduct])
            )
        );
    }

    // UPDATE: replace an existing product
    update( id: number,  product: ProductDraft): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`,
            { ...product, id }
        ).pipe(
            tap(updatedProduct =>
                this.productState.update(products =>
                    products.map(existing =>
                        existing.id === updatedProduct.id ? updatedProduct : existing
                    )
                )
            )
        );
    }

    // DELETE: remove a product
    delete(id: number): Observable<Product> {
        return this.http.delete<Product>(
            `${this.apiUrl}/${id}`
        ).pipe(
            tap(() =>
                this.productState.update(products =>
                    products.filter(product => product.id !== id)
                )
            )
        );
    }



}
