import { IOrder, IProduct, TContactsInfo, TFormErrors, TOrderInfo } from "../types";
import { IEvents } from "./base/events";

export class OrderData implements IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: TFormErrors = {};

  constructor(protected events: IEvents) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }

  // Сохраняем данные формы оформления заказа
  setOrderInfo(field: keyof TOrderInfo, value: string) {
    this[field] = value;

    if (this.validateOrder()) {
      this.events.emit('order:ready');
    }
  }

  // Валидация данных формы офомления заказа
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }
    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    } 
    this.formErrors = errors;
    this.events.emit('order:validation', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Сохраняем данные формы контактной информации
  setContacts(field: keyof TContactsInfo, value: string) {
    this[field] = value;

    if (this.validateContacts()) {
      this.events.emit('contacts:ready');
    }
  }

  // Валидация данных формы контактной информации
  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.email) {
      errors.email = 'Необходимо указать email';
    } 
    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('contacts:validation', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  setItems(data: IProduct[]) {
    this.items = data.map(item => item.id);
  }

  getOrder() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    }
  }

  clear(){
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }
}