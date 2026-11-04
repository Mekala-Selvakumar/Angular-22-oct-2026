import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  selector: 'app-async-demo',
  styleUrl: './async-demo.css',
  templateUrl: './async-demo.html',
})
export class AsyncDemo {
      private api=inject(ApiService);
      users$=this.api.getUsers();
      // The line users = toSignal(this.api.getUsers(), { initialValue: [] }); converts an RxJS Observable (returned by your API service) into an Angular Signal.
      users1=toSignal(this.api.getUsers(),{initialValue:[]});
}
