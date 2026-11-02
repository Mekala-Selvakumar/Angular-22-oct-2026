import { computed, Service, signal } from '@angular/core';
import { Product, ProductDraft } from '../models/product';

@Service()
export class ProductService {
    // productList:Product[]=[       
    //      {
    //         id: 101,
    //         name: 'Laptop',
    //         category: 'Electronics',
    //         price: 65000,
    //         stockQuantity: 12
    //     },
    //     {
    //         id: 102,
    //         name: 'Keyboard',
    //         category: 'Accessories',
    //         price: 1500,
    //         stockQuantity: 4
    //     },
    //     {
    //         id: 103,
    //         name: 'Monitor',
    //         category: 'Electronics',
    //         price: 12000,
    //         stockQuantity: 0
    //     },
    //     {
    //         id: 104,
    //         name: 'Mouse',
    //         category: 'Accessories',
    //         price: 800,
    //         stockQuantity: 25
    //     },
    //     {
    //         id: 105,
    //         name: 'Office Chair',
    //         category: 'Office',
    //         price: 8500,
    //         stockQuantity: 3
    //     }

    // ];

    // //getAll products

    // getAllProducts(): Product[]{
    //     return this.productList;
    // }
    // //  get Product By Id
    // getProductById(id:number):Product|undefined {
    //     return this.productList.find(product=>product.id===id);
    // }

    // //  Add a new Product
    // addProduct(product: Product): void{
    //     const newId=this.productList.length>0 ?
    //      Math.max(...this.productList.map(p=>p.id))+1 :1;
    //      const newProduct:Product={
    //             ...product,
    //             id: newId
    //      }
    //       this.productList.push(newProduct);
    // }



        private readonly productState = signal<Product[]>([
        {
            id: 101,
            name: 'Laptop',
            sku: 'LAP-1001',
            category: 'Electronics',
            price: 65000,
            stockQuantity: 12
        },
        {
            id: 102,
            name: 'Keyboard',
            sku: 'KEY-1002',
            category: 'Accessories',
            price: 1500,
            stockQuantity: 4
        },
        {
            id: 103,
            name: 'Monitor',
            sku: 'MON-1003',
            category: 'Electronics',
            price: 12000,
            stockQuantity: 0
        }
    ]);

    private nextId = 104;

    // Public read-only view of product data
    readonly products = this.productState.asReadonly();

    // Derived information
    readonly totalProducts = computed(
        () => this.productState().length
    );

    readonly lowStockProducts = computed(() =>
        this.productState().filter(
            product => product.stockQuantity <= 5
        )
    );

    readonly totalInventoryValue = computed(() =>
        this.productState().reduce(
            (total, product) =>
                total + product.price * product.stockQuantity,
            0
        )
    );

    // Retrieve all products
    getProducts(): Product[] {
        return this.productState();
    }

    // Retrieve one product
    getProductById(id: number): Product | undefined {
        return this.productState().find(
            product => product.id === id
        );
    }

    // Add a new product
    addProduct(draft: ProductDraft): Product {
        const product: Product = {
            ...draft,
            id: this.nextId++,
            name: draft.name.trim(),
            sku: (draft.sku ?? '').trim().toUpperCase()
        };

        this.productState.update(products => [
            ...products,
            product
        ]);

        return product;
    }

    // Update an existing product
    updateProduct(
        id: number,
        changes: Partial<ProductDraft>
    ): void {
        this.productState.update(products =>
            products.map(product =>
                product.id === id
                    ? { ...product, ...changes, id: product.id }
                    : product
            )
        );
    }

    // Delete a product
    deleteProduct(id: number): void {
        this.productState.update(products =>
            products.filter(product => product.id !== id)
        );
    }

    // Increase or decrease inventory
    updateStock(id: number, change: number): void {
        this.productState.update(products =>
            products.map(product =>
                product.id === id
                    ? {
                        ...product,
                        stockQuantity: Math.max(
                            0,
                            product.stockQuantity + change
                        )
                    }
                    : product
            )
        );
    }
}




