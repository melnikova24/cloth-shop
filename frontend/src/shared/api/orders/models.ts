import {Product} from "../products";

export interface IOrder {
    user?: {
        name: string;
        email: string;
    }
    _id: string;
    sumOfCart: number;
    products: Product[];
    orderDate: string;
    status: string;
    personId: string;
}

