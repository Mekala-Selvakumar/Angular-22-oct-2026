import { Component } from '@angular/core';
import { createLog } from '../../rxjs-examples/log';
import { Observable, Subscription } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-observable-basics',
  styleUrl: './observable-basics.css',
  templateUrl: './observable-basics.html',
})
export class ObservableBasics {

    log = createLog();
  private sub?: Subscription;
  start() {
    this.stop();
    this.log.clear();
    const counter$: Observable<number> = new Observable<number>(subscriber => {
      let n = 0
      const id = setInterval(() => {
        n++;
        subscriber.next(n);
        if (n == 5)
          subscriber.complete();
      }, 1000);
      return () => {
        clearInterval(id);
        this.log.add('tear down: timer cleaned up')
      }
    });
    this.sub = counter$.subscribe({
      next: (value) => this.log.add(`next: ${value}`),
      error: (err) => this.log.add(`error: ${err}`),
      complete: () => this.log.add('complete')
    });

  }
  stop() {
    this.sub?.unsubscribe();
  }

}
