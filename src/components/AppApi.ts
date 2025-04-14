import { IProduct, IOrder } from '../types';
import { Api, ApiListResponse } from './base/api'

export interface IApi {
  getProducts: () => Promise<IProduct[]>;
  postOrder: (data: IOrder) => Promise<ApiListResponse<string>>;
}

export class AppApi extends Api implements IApi{
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
    this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get(`/product`)
		  .then((res: ApiListResponse<IProduct>) => 
				res.items.map((item) => ({
					...item,
					image: this.cdn + item.image
				}))
			);
		}

	postOrder(data: IOrder): Promise<ApiListResponse<string>> {
		return this.post(`/order`, data)
		  .then((res: ApiListResponse<string>) => res);
	}
}