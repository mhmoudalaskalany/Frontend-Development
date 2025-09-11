import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChildSignal } from '../components/child-signal/child-signal';

@Component({
  selector: 'app-signals',
  imports: [FormsModule, ChildSignal],
  templateUrl: './signals.html',
  styleUrl: './signals.css',
})
export class Signals implements OnInit {
  count = signal(0);
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
