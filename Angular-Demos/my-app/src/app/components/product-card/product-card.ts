import { Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ProductCard {

  @Input() productName: string = '';
  // @Input("productName") prodName: string = '';

  // @Output() productSelected = new EventEmitter<string>();
  
  @Output() childEvent = new EventEmitter<string>();

    constructor() {
        console.log('Component instance constructed');
    }
    ngOnInit(): void {
        console.log('Initial product:', this.productName);
    }
    fireEvent() {
        this.childEvent.emit('Event fired from child component');
    }
        ngOnChanges(
        changes: SimpleChanges<ProductCard>
    ): void {

        const change = changes.productName;

        if (change) {
            console.log('Previous product:', change.previousValue);
            console.log('Current product:', change.currentValue);
            console.log('First change:', change.firstChange);
        }
    }



}
