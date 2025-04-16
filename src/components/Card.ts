import { Component } from "./base/component";
import { IProduct } from "../types";
import { categories } from "../utils/constants";

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected _description?: HTMLElement;
  protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;
	protected cardId: string;

	constructor(protected container: HTMLElement, actions?: ICardActions) {
		super(container);

    this._description = this.container.querySelector('.card__text');
    this._image = this.container.querySelector('.card__image');
    this._title = this.container.querySelector('.card__title');
    this._category = this.container.querySelector('.card__category');
    this._price = this.container.querySelector('.card__price');
		this._button = this.container.querySelector('.card__button');
		this._index = this.container.querySelector(`.basket__item-index`);
		
		if (actions?.onClick) {
			if (this._button) {
					this._button.addEventListener('click', actions.onClick);
			} else {
					container.addEventListener('click', actions.onClick);
			}
	  }
	}

  set id(value: string) {
		this.cardId = value; 
	}

	get id() {
		return this.cardId || '';
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

  set title(value: string) {
    this.setText(this._title, value);
  }

  set category(value: string) {
    this.setText(this._category, value);
		this.toggleClass(this._category, categories[value]);
  }

  set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		this.setDisabled(this._button, !value);
	}

  set button(value: string) {
    this.setText(this._button, value);
  }

	set index(value: number) {
    this.setText(this._index, value);
  }
}