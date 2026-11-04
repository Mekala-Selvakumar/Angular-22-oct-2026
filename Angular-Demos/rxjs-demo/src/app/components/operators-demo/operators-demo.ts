import { Component, DestroyRef, inject } from '@angular/core';
import { createLog } from '../../rxjs-examples/log';
import { filter, interval, map, Subscription, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [],
  selector: 'app-operators-demo',
  styleUrl: './operators-demo.css',
  templateUrl: './operators-demo.html',
})
export class OperatorsDemo {
  log=createLog();
  // it replace the  ngOnDestroy() method and automatically unsubscribes from the observable when the component is destroyed.
  // Modern Angular provides a built-in mechanism to automatically clean up subscriptions when a component is destroyed,
  //  using the takeUntilDestroyed operator from the @angular/core/rxjs-interop package. 
  // This operator allows you to specify a DestroyRef, which is a reference to the component's destruction lifecycle. When the component is destroyed, any subscriptions that were created with takeUntilDestroyed will be automatically unsubscribed, preventing memory leaks and ensuring that resources are properly released.
  private destroyRef=inject(DestroyRef);
  private sub?:Subscription;
  run(){
    this.sub?.unsubscribe();
    this.log.clear();
    //• Emits ascending numbers (0, 1, 2, 3...) every 500 milliseconds.
    this.sub=interval(500).pipe(
      take(10),
      tap(n=>this.log.add(`source : ${n}`)),
      filter(n=>n%2==0),
      map(n=>n*10),
      takeUntilDestroyed(this.destroyRef)  //clean up - auto cleanup when component is destroyed
    ).subscribe({
      next: (value) => this.log.add(`next: ${value}`),
      error: (err) => this.log.add(`error: ${err}`),
      complete: () => this.log.add('complete')
    });
  }
}
// Watches your component. If the user leaves the page before the 10 numbers finish, it cleanly cancels the subscription to prevent memory leaks.
