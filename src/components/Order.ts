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
      this._online.classList.add('button_alt-active');
      this._cash.classList.remove('button_alt-active');
      this.onInputChange('payment', 'Онлайн');
    })
 
    this._cash.addEventListener('click', () => {
      this._cash.classList.add('button_alt-active');
      this._online.classList.remove('button_alt-active');
      this.onInputChange('payment', 'При получении');
    })
  }

  set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

  // Снять выбор c кнопок способа оплаты
  disableButtons() {
    this._online.classList.remove('button_alt-active');
    this._cash.classList.remove('button_alt-active');
  }
}