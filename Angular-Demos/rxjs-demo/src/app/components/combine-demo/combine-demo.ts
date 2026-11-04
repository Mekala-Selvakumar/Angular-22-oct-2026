import { Component, inject, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, map } from 'rxjs';
import { Post, Todo, User } from '../../models/models';
import { ApiService } from '../../services/api-service';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  selector: 'app-combine-demo',
  styleUrl: './combine-demo.css',
  templateUrl: './combine-demo.html',
})
export class CombineDemo {
    private api = inject(ApiService);

  // ----- combineLatest -----
  private term$ = new BehaviorSubject('');

  filteredUsers$ = combineLatest([this.api.getUsers(), this.term$]).pipe(
    map(([users, term]) =>
      users.filter(u => u.name.toLowerCase().includes(term.toLowerCase()))
    )
  );

  onTerm(e: Event) {
    this.term$.next((e.target as HTMLInputElement).value);
  }

  // ----- forkJoin -----
  dashboard = signal<{ user: User; posts: Post[]; todos: Todo[] } | null>(null);

  loadDashboard(id: number) {
    forkJoin({
      user: this.api.getUserById(id),
      posts: this.api.getPostsByUserId(id),
      todos: this.api.getTodosByUserId(id),
    }).subscribe(data => this.dashboard.set(data));
  }

}
