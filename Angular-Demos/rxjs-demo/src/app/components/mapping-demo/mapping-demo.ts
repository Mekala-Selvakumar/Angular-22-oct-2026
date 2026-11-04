import { Component, signal } from '@angular/core';
import { createLog } from '../../rxjs-examples/log';
import { concatMap, delay, exhaustMap, mergeMap, of, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Op = 'switchMap' | 'mergeMap' | 'concatMap' | 'exhaustMap';
@Component({
  imports: [],
  selector: 'app-mapping-demo',
  styleUrl: './mapping-demo.css',
  templateUrl: './mapping-demo.html',
})
export class MappingDemo {
    ops: Op[] = ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'];
  counter = signal(0);
 
  logs = {
    switchMap: createLog(),
    mergeMap: createLog(),
    concatMap: createLog(),
    exhaustMap: createLog(),
  };
 
  // One "click stream" per operator, so each is tested independently
  private clicks = {
    switchMap: new Subject<number>(),
    mergeMap: new Subject<number>(),
    concatMap: new Subject<number>(),
    exhaustMap: new Subject<number>(),
  };
 
  constructor() {
    this.clicks.switchMap
      .pipe(switchMap(id => this.fakeRequest('switchMap', id)), takeUntilDestroyed())
      .subscribe(r => this.logs.switchMap.add(`✔ ${r}`));
 
    this.clicks.mergeMap
      .pipe(mergeMap(id => this.fakeRequest('mergeMap', id)), takeUntilDestroyed())
      .subscribe(r => this.logs.mergeMap.add(`✔ ${r}`));
 
    this.clicks.concatMap
      .pipe(concatMap(id => this.fakeRequest('concatMap', id)), takeUntilDestroyed())
      .subscribe(r => this.logs.concatMap.add(`✔ ${r}`));
 
    this.clicks.exhaustMap
      .pipe(exhaustMap(id => this.fakeRequest('exhaustMap', id)), takeUntilDestroyed())
      .subscribe(r => this.logs.exhaustMap.add(`✔ ${r}`));
  }
 
  click() {
    const id = this.counter() + 1;
    this.counter.set(id);
    for (const op of this.ops) {
      this.logs[op].add(`click #${id}`);
      this.clicks[op].next(id);
    }
  }
 
  private fakeRequest(op: Op, id: number) {
    return of(`response for #${id}`).pipe(
      tap(() => this.logs[op].add(`→ request #${id} started`)),
      delay(2000)
    );
  }

}
