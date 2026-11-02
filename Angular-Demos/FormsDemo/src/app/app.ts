import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { InventorySummary } from './components/inventory-summary/inventory-summary';
import { HttpProductList } from './components/http-product-list/http-product-list';
import { AddReactiveProduct } from './components/add-reactive-product/add-reactive-product';
import { AddTemplateProduct } from './components/add-template-product/add-template-product';
import { LoginDemo } from './components/login-demo/login-demo';
import { ReactiveLogin } from './components/reactive-login/reactive-login';

@Component({
  imports: [RouterOutlet, ProductList, InventorySummary, HttpProductList,
    AddTemplateProduct, AddReactiveProduct, LoginDemo, ReactiveLogin],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('FormsDemo');
}
