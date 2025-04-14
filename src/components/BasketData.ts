import { IBasketData, IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
  protected _cards: IProduct[];

  constructor(protected events: IEvents) {
    this._cards = [];
  }

  set cards(data: IProduct[]) {
    this._cards = data;
  }

  get cards(){
    return this._cards;
  }
  
  addCard(card: IProduct) {
    this.cards.push(card);
    this.events.emit('basket:changed');
  }

  deleteCard(cardId: string, payload: Function | null = null) {
    this._cards = this._cards.filter(card => card.id !== cardId);

    if(payload) {
        payload();
    } else {
        this.events.emit('basket:changed');
    }
  }

  clear() {
    this.cards = []
    this.events.emit('basket:changed');
  }

  getAmount() {
    return this.cards.length;
  }

  getTotal() {
    return this.cards.reduce((total, card) => total + card.price, 0);
  }

  isInBasket(card: IProduct) {
        return this.cards.includes(card);
  }
}


