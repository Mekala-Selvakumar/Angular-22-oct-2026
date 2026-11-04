import { Component, inject, signal } from '@angular/core';
import { catchError, defer, finalize, Observable, of, retry, throwError, timer } from 'rxjs';
import { createLog } from '../../rxjs-examples/log';
import { ApiService } from '../../services/api-service';

@Component({
  imports: [],
  selector: 'app-error-demo',
  styleUrl: './error-demo.css',
  templateUrl: './error-demo.html',
})
export class ErrorDemo {
    private api = inject(ApiService);
  log = createLog();
  loading = signal(false);

  // Fails on attempts 1 and 2, succeeds on attempt 3
  private flaky(): Observable<string> {
    let calls = 0;
    return defer(() => {
      calls++;
      this.log.add(`attempt ${calls}`);
      return calls < 3
        ? throwError(() => new Error(`failure #${calls}`))
        : of('✔ success on attempt 3');
    });
  }

  // Real request that returns 404
  private broken(): Observable<unknown> {
    return defer(() => {
      this.log.add('attempt: GET /users/9999');
      return this.api.getUserById(9999);
    });
  }

  runFlaky() { this.start(this.flaky(), 'Flaky API'); }
  runBroken() { this.start(this.broken(), 'Broken API'); }

  private start(source$: Observable<unknown>, label: string) {
    this.log.clear();
    this.log.add(`--- ${label} ---`);
    this.loading.set(true);

    source$.pipe(
      retry({
        count: 2,                                   // 1 try + 2 retries = 3 attempts
        delay: (err, n) => {
          this.log.add(`error: ${err.message} → retry #${n} in ${n}s`);
          return timer(n * 1000);                   // backoff: 1s, 2s
        },
      }),
      catchError(err => {
        this.log.add(`gave up: ${err.message}`);
        return of('fallback value');                // graceful fallback
      }),
      finalize(() => this.loading.set(false))       // always hide the spinner
    ).subscribe(v => this.log.add(`result: ${typeof v === 'string' ? v : JSON.stringify(v)}`));
  }

}
