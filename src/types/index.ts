export interface IProduct {
  id: string;
  description: string;
  image: string; 
  title: string;
  category: string;
  price: number | null;
  isInBasket?: boolean;
  index?: number;
}

export interface IProductsData {
	cards: IProduct[];
	preview: string | null;
}

export interface IBasketData {
	cards: IProduct[];
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string [];
}

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TContactsInfo = Pick<IOrder, 'email' | 'phone'>;

export type TFormErrors = Partial<Record<keyof IOrder, string>>;