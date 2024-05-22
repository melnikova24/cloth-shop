import {Product} from "../products";

export interface IOrder {
    _id: string;
    sumOfCart: number;
    products: Product[];
    orderDate: string;
    status: string;
    personId: string;
}

