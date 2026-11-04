import { Component, computed, inject, signal } from '@angular/core';
import { Post,  Todo, User } from '../../models/models';
import { ApiService } from '../../services/api-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, Observable, of, retry, startWith, switchMap, timer } from 'rxjs';
 
type DashboardData = { user: User; posts: Post[]; todos: Todo[] };

type State =
  | { status: 'loading' }
  | { status: 'success'; data: DashboardData }
  | { status: 'error'; message: string };

const LOADING: State = { status: 'loading' };

@Component({
  imports: [],
  selector: 'app-user-dashboard',
  styleUrl: './user-dashboard.css',
  templateUrl: './user-dashboard.html',
})
export class UserDashboard {
    private api = inject(ApiService);

  // ----- INPUT STATE -----
  userId = signal(1);
  private tick = signal(0);   // bump this to force a reload

  private request = computed(() => ({ id: this.userId(), tick: this.tick() }));

  // ----- THE RXJS PIPELINE -----
  state = toSignal(
    toObservable(this.request).pipe(
      // New request → cancel the old one (switchMap)
      switchMap(({ id }) => this.load(id)),
    ),
    { initialValue: LOADING }
  );

  private load(id: number): Observable<State> {
    return forkJoin({
      user: this.api.getUserById(id),
      posts: this.api.getPostsByUserId(id),
      todos: this.api.getTodosByUserId(id),
    }).pipe(
      retry({ count: 2, delay: (_err, n) => timer(n * 500) }),          // backoff
      map((data): State => ({ status: 'success', data })),
      catchError((): Observable<State> =>                                // inside!
        of({ status: 'error', message: 'Could no load this user. Please try again.' })
      ),
      startWith(LOADING)                                                 // show spinner first
    );
  }

  // ----- ACTIONS -----
  onSelect(e: Event) {
    this.userId.set(Number((e.target as HTMLSelectElement).value));
  }

  reload() {
    this.tick.update(t => t + 1);
  }

}
