import {Component} from "./base/component";
import {ensureElement} from "./../utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    private successDescription: HTMLElement;
    protected _close: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this.successDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total (value: number){
        this.successDescription.textContent = `Списано ${value} синапсов`;
    }
}