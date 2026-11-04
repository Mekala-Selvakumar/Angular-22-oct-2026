import { of, map, filter, tap, distinctUntilChanged } from 'rxjs';

export function mapDemo1(){
const products$ = of(
    { id: 101, name: 'Laptop', price: 65000 },
    { id: 102, name: 'Keyboard', price: 1500 }
);

const productNames$ = products$.pipe(
    map(product => product.name)
);

productNames$.subscribe(console.log);


 
const prices$ = of(100, 200, 300);

const discountedPrices$ = prices$.pipe(
    map(price => price * 0.9)
);

discountedPrices$.subscribe(console.log);
}

export  function  filterDemo1(){
 
const prices$ = of(500, 1500, 65000, 12000);

const expensiveProducts$ = prices$.pipe(
    filter(price => price >= 10000)
);

expensiveProducts$.subscribe(console.log);

const products$ = of(
    { id: 101, name: 'Laptop', price: 65000 },
    { id: 102, name: 'Keyboard', price: 1500 }
);

const productNames$ = products$.pipe(
   filter(product => product.price >= 10000),
    map(product => product.name)
);
productNames$.subscribe(console.log);

prices$.pipe(
    tap(price=> console.log(`Price: ${price}`)),
    filter(price => price >= 10000),
    map(price => price * 0.9),
    tap(discountedPrice => console.log(`Discounted Price: ${discountedPrice}`))

).subscribe();


}

export function distinctUntilChangedDemo1(){
 
of('Laptop', 'Laptop', 'Keyboard', 'Keyboard', 'Laptop','Monitor')
    .pipe(distinctUntilChanged())
    .subscribe(console.log);

}