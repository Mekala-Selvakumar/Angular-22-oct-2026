import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../models/models';
 import { catchError, debounceTime, distinctUntilChanged, of,  switchMap, tap } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-typeaheaddemo',
  styleUrl: './typeaheaddemo.css',
  templateUrl: './typeaheaddemo.html',
})
export class Typeaheaddemo {
    private api = inject(ApiService);

  term = signal('');
  searching = signal(false);

  results = toSignal(
    toObservable(this.term).pipe(
      debounceTime(300),                 // wait until typing pauses
      distinctUntilChanged(),            // skip identical consecutive text
      tap(() => this.searching.set(true)),
      switchMap(term =>
        term.trim()
          ? this.api.searchUsersByName(term).pipe(
              catchError(() => of([] as User[]))   // error handled INSIDE
            )
          : of([] as User[])
      ),
      tap(() => this.searching.set(false))
    ),
    { initialValue: [] as User[] }
  );

  onInput(e: Event) {
    this.term.set((e.target as HTMLInputElement).value);
  }

}
