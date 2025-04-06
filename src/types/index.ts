export interface IProduct {
  id: string;
  description: string;
  image: string; 
  title: string;
  category: string;
  price: number | null;
}

export interface IProductsData {
	cards: IProduct[];
	preview: string | null;  // для сохранения id выбранной карточки товара
	getCard(cardId: string): IProduct;
}

export interface IBasketData {
	cards: IProduct[];
  total: number | null;
	addCard(cardId: string): void;
	deleteCard(cardId: string): void;
}

export type TPayment = 'Онлайн' | 'При получении';

interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string [];
  checkValidation(data: Record<keyof TOrderInfo, string>): boolean;
  checkContactsValidation(data: Record<keyof TContactsInfo, string>): boolean;
}

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TContactsInfo = Pick<IOrder, 'email' | 'phone'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}