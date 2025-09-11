import { Component, Signal, input } from '@angular/core';

@Component({
  selector: 'app-child-signal',
  imports: [],
  templateUrl: './child-signal.html',
  styleUrl: './child-signal.css',
})
export class ChildSignal {
   internalCount = input<Signal<number>>();
}
