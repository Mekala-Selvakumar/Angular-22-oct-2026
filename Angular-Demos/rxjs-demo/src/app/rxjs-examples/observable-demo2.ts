import { of } from 'rxjs';

export  function observableDemo2(){
const products$ = of('Laptop', 'Keyboard');

products$.subscribe(value => console.log('A:', value));

products$.subscribe(value => console.log('B:', value));
}
