import { Observable } from "rxjs";
    import {of} from 'rxjs';


export function observableDemo1() {
    const observable = new Observable((observer) => { 
        observer.next(10);
        observer.next(20);
        observer.next(30);
        observer.complete();
    });

    observable.subscribe({
        next: (value) => console.log(value),
        error: (err) => console.error(err),
        complete: () => console.log('Observable completed')
    });

    console.log('----------------------')
    // Observable can execute synchronously, or asynchronously depending on the
    //  implementation of the observable. In this case, it executes synchronously.
    console.log('Observable - Synchronous execution demo')
    console.log('Before subscribing to the observable');
    const observable2 = of(1, 2, 3, 4, 5);
    observable2.subscribe({
        next: (value) => console.log(value),
        error: (err) => console.error(err),
        complete: () => console.log('Observable completed')
    });

    console.log('After subscribing to the observable');
    console.log('----------------------')
    console.log('Observable - Asynchronous execution demo')
    console.log('Before subscribing to the observable');
    
    const observable3 = new Observable((observer) => {
        setTimeout(() => {
            observer.next(100);
            observer.complete();
        }, 1000);
    });

    observable3.subscribe({
        next: (value) => console.log(value),
        error: (err) => console.error(err),
        complete: () => console.log('Observable completed')
    });

    console.log('After subscribing to the observable');
}