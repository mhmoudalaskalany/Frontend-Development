import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  inject,
  Injector,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChildSignal } from '../components/child-signal/child-signal';

@Component({
  selector: 'app-signals',
  imports: [FormsModule, ChildSignal],
  templateUrl: './signals.html',
  styleUrl: './signals.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signals implements OnInit {
  count: WritableSignal<number> = signal(0);
  doubleCount: Signal<number> = computed(() => this.count() * 2);
  showCount: WritableSignal<boolean> = signal(false);
  count2: WritableSignal<number> = signal(0);

  // this is to allow effect outside the constructor
  private injector = inject(Injector);
  private loggingEffectReference!: EffectRef;
  conditionalCount: Signal<any> = computed(() => {
    if (this.showCount()) {
      return `The count is ${this.count2()}`;
    } else {
      return 'Nothing to see here !';
    }
  });

  constructor() {
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }

  ngOnInit() {
    this.initializeLogging();
  }
  printCurrentCountValue = (): void => {
    this.count();
  };

  increment = (): void => {
    this.count.set(this.count() + 1);
  };

  updateFromPreviousValue = (): void => {
    this.count.update((value) => value + 1);
  };

  enableConditionalCount = (): void => {
    this.showCount.set(true);
  };

  disableConditionalCount = (): void => {
    this.showCount.set(false);
  };

  incrementConditionalCount = (): void => {
    this.count2.update((value) => value + 1);
  };

  // running effects outside constructor
  initializeLogging = (): void => {
    this.loggingEffectReference = effect(
      () => {
        console.log(`Current Count 1 is ${this.count()}`);
      },
      { injector: this.injector }
    );
  };
  // Destroying Effects
  // effects are destroyed automatically when  (its context(service or component)) is destroyed
  // to destroy it manually use EffectRef.destroy()

  destroyEffect = () => {
    this.loggingEffectReference.destroy();
  };
}
