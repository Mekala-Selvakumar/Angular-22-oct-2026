import { Component, computed, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-counter',
  styleUrl: './counter.css',
  templateUrl: './counter.html',
})
export class Counter {

    // Normal class variable
  normalCount = 0;
  // Signal
  signalCount = signal(0);
  incrementNormal() {
    this.normalCount++;
  }
  resetNormal(){
    this.normalCount=0;
  }
  incrementSignal() {
    this.signalCount.update(value => value + 1);
  }
resetSignal(){
  this.signalCount.set(0);
}

    // Normal variables
  price = 500;
  quantity = 2;
  total = 1000;

  increaseQuantity() {
    this.quantity++;
  }
  recalculateTotal() {
    this.total = this.price * this.quantity;
  }

  // Signals
  signalPrice = signal(500);
  signalQuantity = signal(2);

  signalTotal = computed(
    () => this.signalPrice() * this.signalQuantity()
  );

  increaseSignalQuantity() {
    this.signalQuantity.update(q => q + 1);
  }

}
