import {orderModel} from "../models/orderModel.js";
import {cartModelM} from "../models/cartModel.js";


export const editOrder = async (personId, products, sumOfCart, status) => {
    const orders = await orderModel.findOneAndUpdate({personId}, {products, sumOfCart, status});
    return orderModel.findOne({personId});
}

export const createOrder = async ( personId, products, sumOfCart ) => {
    const orders = await orderModel.create({ personId, products, sumOfCart, status: 'на рассмотрении' });
    await cartModelM.findOneAndUpdate({personId}, {products: []});
    await orders.save();
    return orders;
}

export const takeOrders = async (personId) => {
    return orderModel.find({personId});
}


