import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
})
export class StockStatusPipe implements PipeTransform {
  transform(stockQuantity:number, reorderLevel:number=5): string {
    if (stockQuantity==0){
      return 'Out of Stock'
    }
    if (stockQuantity<=reorderLevel){
      return "Low Stock"
    }
     return "In Stock";
  }
}
