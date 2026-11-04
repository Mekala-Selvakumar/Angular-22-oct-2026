import { combineLatest, of } from 'rxjs';

export function combineLatestDemo1() {
const productName$ = of('Laptop','Mobile','Tablet');
const productPrice$ = of(65000, 25000, 35000);

combineLatest([
    productName$,
    productPrice$
]).subscribe(([name, price]) => {
    console.log(name);
    console.log(price);

});
}