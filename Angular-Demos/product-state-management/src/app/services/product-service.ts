import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Product, ProductDraft } from '../model/product';
import { Observable, tap } from 'rxjs';
 
@Service()
export class ProductService {
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
    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl).pipe(
            tap(products => this.productState.set(products))
        );
    }

    getById(id: number): Observable<Product> {
        // http://localhost:300/products/101
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    // CREATE: add a new product
    addProduct(product: ProductDraft): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product).pipe(
            tap(createdProduct =>
                this.productState.update(products => [...products, createdProduct])
            )
        );
    }

    // UPDATE: replace an existing product
    updateProduct( id: number,  product: ProductDraft): Observable<Product> {
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
    deleteProduct(id: number|string): Observable<Product> {
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
// @Service()
// export class ProductService {
//   private http = inject(HttpClient);
//   private apiUrl = 'http://localhost:3000/products';

//   private readonly productState = new BehaviorSubject<Product[]>([]);
//   readonly products$ = this.productState.asObservable();

//   readonly totalProducts$ = this.products$.pipe(map(list => list.length));

//   getAllProducts(): Observable<Product[]> {
//     return this.http.get<Product[]>(this.apiUrl).pipe(
//       tap(list => this.productState.next(list))
//     );
//   }

//   addProduct(p: ProductDraft): Observable<Product> {
//     return this.http.post<Product>(this.apiUrl, p).pipe(
//       tap(created => this.productState.next([...this.productState.value, created]))
//     );
//   }
// }