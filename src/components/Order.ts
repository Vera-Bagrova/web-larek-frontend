import { Form } from './common/Form';
import { TOrderInfo } from '../types';
import { IEvents } from './base/events';

export class Order extends Form<TOrderInfo> {
  protected _online: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this._online = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    this._online.addEventListener('click', () => {
      this.toggleOnline();
      this.toggleCash(false);
      this.onInputChange('payment', 'Онлайн');
    })
 
    this._cash.addEventListener('click', () => {
      this.toggleCash();
      this.toggleOnline(false);
      this.onInputChange('payment', 'При получении');
    })
  }

  set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

  toggleOnline(state: boolean = true) {
    this.toggleClass(this._online, 'button_alt-active', state);
  }

  toggleCash(state: boolean = true) {
    this.toggleClass(this._cash, 'button_alt-active', state);
  } 
}