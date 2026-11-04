import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { observableDemo1 } from './rxjs-examples/observable-demo1';
import { Observable, Subscription } from 'rxjs';
import { createLog } from './rxjs-examples/log';
import { observableDemo2 } from './rxjs-examples/observable-demo2';
import { distinctUntilChangedDemo1, filterDemo1, mapDemo1 } from './rxjs-examples/map-demo1';
import { switchMapDemo1 } from './rxjs-examples/switchamp-demo1';
import { combineLatestDemo1 } from './rxjs-examples/combinelatest-demo1';
import { OperatorsDemo } from './components/operators-demo/operators-demo';
import { ObservableBasics } from './components/observable-basics/observable-basics';
import { ErrorDemo } from './components/error-demo/error-demo';
import { UserDashboard } from './components/user-dashboard/user-dashboard';
import { MappingDemo } from './components/mapping-demo/mapping-demo';
import { AsyncDemo } from './components/async-demo/async-demo';
import { CombineDemo } from './components/combine-demo/combine-demo';
import { Typeaheaddemo } from './components/typeaheaddemo/typeaheaddemo';
 
@Component({
  imports: [RouterOutlet, ObservableBasics, OperatorsDemo,AsyncDemo, MappingDemo, UserDashboard, ErrorDemo,CombineDemo, Typeaheaddemo],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('rxjs-demo');
  executedemo() {
    observableDemo1();
  }
  executedemo1(){
      observableDemo2();
  }
  executeMapDemo1(){
    mapDemo1();
  }
  executeFilterDemo1(){
    filterDemo1();
    distinctUntilChangedDemo1();
  }

  excuteSwitchMapDemo1(){
    switchMapDemo1();
  }
  executeCombineLatestDemo1(){
    combineLatestDemo1();
  }



}
