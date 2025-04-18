import { Component } from "./base/component";
import { createElement, ensureElement } from "./../utils/utils";
import { EventEmitter } from "./base/events";

interface IBasket {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this._button, true);
        }
    }

    set selected(total: number) {
        this.setDisabled(this._button, !total);
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}