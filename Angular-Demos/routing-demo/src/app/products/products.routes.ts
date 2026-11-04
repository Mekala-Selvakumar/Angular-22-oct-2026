import { Routes } from "@angular/router";
import { ProductsShell } from "./products-shell/products-shell";

export const PRODUCT_ROUTES:Routes = [
    {
    path:'',
    component:ProductsShell,
    children:[
        {
            path:'',
            title:'Products',
            loadComponent:()=>import('./product-list/product-list')
            .then(c=>c.ProductList)
        },
        {
            path:':id',
            title:'Product Details',
            loadComponent:()=>import('./product-detail/product-detail')
            .then(c=>c.ProductDetail)
        }
    ],
}
]
