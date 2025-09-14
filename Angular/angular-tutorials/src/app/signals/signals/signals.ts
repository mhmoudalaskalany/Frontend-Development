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
  linkedSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ChildSignal } from '../components/child-signal/child-signal';
export interface ShippingMethod {
  id: number;
  name: string;
}
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

  //-----------------------AdvancedTopics-----------------------
  // Linked Signals
  shippingOptions: WritableSignal<ShippingMethod[]> = signal([
    {
      id: 1,
      name: 'air',
    },
    {
      id: 2,
      name: 'sea',
    },
    {
      id: 3,
      name: 'ground',
    },
  ]);

  selectedOption: WritableSignal<ShippingMethod> = signal(this.shippingOptions()[0]);

  changeShippingMethod = (event: Event): void => {
    const target = event.target as HTMLSelectElement;
    const index = parseInt(target.value, 10);
    this.selectedOption.set(this.shippingOptions().filter((x) => x.id == index)[0]);
  };

  // update the options to different value to make second signal invalid
  changeShippingOptions = () => {
    this.shippingOptions.set([
      {
        id: 1,
        name: 'Email',
      },
      {
        id: 2,
        name: 'Will Call',
      },
      {
        id: 3,
        name: 'Postal Service',
      },
    ]);
    console.log('select options after changing shipping methods', this.selectedOption());
  };
  // change the shippingOptions to  invalid value may set the selectedOption to invalid value
  // to fix this we  need to use linkedSignal

  shippingOptionsLinked: WritableSignal<ShippingMethod[]> = signal([
    {
      id: 1,
      name: 'air',
    },
    {
      id: 2,
      name: 'sea',
    },
    {
      id: 3,
      name: 'ground',
    },
  ]);

  selectedOptionLinked = linkedSignal(() => this.shippingOptionsLinked()[0]);

  changeShippingMethodLinked = (event: Event): void => {
    const target = event.target as HTMLSelectElement;
    const index = parseInt(target.value, 10);
    this.selectedOptionLinked.set(this.shippingOptionsLinked().filter((x) => x.id == index)[0]);
  };

  // update the shipping options value and check the linked selected option signal value on html
  // it will be valid not like above one
  changeShippingOptionsLinked = () => {
    this.shippingOptionsLinked.set([
      {
        id: 1,
        name: 'Email',
      },
      {
        id: 2,
        name: 'Will Call',
      },
      {
        id: 3,
        name: 'Postal Service',
      },
    ]);
    console.log(
      'linked select options after changing shipping methods',
      this.selectedOptionLinked()
    );
  };
}
