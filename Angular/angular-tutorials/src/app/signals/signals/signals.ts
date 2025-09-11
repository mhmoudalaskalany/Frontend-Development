import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChildSignal } from '../components/child-signal/child-signal';

@Component({
  selector: 'app-signals',
  imports: [FormsModule, ChildSignal],
  templateUrl: './signals.html',
  styleUrl: './signals.css',
})
export class Signals implements OnInit {
  count: WritableSignal<number> = signal(0);
  doubleCount: Signal<number> = computed(() => this.count() * 2);
  constructor() {}

  ngOnInit = () => void {};
  printCurrentCountValue = (): void => {
    this.count();
  };

  increment = (): void => {
    this.count.set(this.count() + 1);
  };

  updateFromPreviousValue = (): void => {
    this.count.update((value) => value + 1);
  };
}
