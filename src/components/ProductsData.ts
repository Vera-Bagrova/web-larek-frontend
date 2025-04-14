import { IProduct, IProductsData } from "../types";
import { IEvents } from "./base/events";

export class ProductsData implements IProductsData {
    protected _cards: IProduct[] = [];
    preview: string | null;

    constructor(protected events: IEvents) {
        this.events = events;
    }

    set cards(cards:IProduct[]) {
        this._cards = cards;
        this.events.emit('cards:changed');
    }

    get cards () {
        return this._cards;
    }

    setPreview(card: IProduct) {
        this.preview = card.id;
        this.events.emit('card:selected', card);
    }
}