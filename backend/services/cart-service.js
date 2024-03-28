import {cartModelM} from "../models/cartModel.js";

export const createCart = async ( userId, productIds ) => {
    const cart = await cartModelM.create({ personId: userId, products: productIds });
    await cart.save();
    return cart;
}

export const editCart = async (personId, productIds) => {
    const cart = await cartModelM.findOneAndUpdate({personId}, {products: productIds});
    return cart;
}

export const receiveCart = async (personId) => {
    const cart = await cartModelM.findOne({personId});
    return cart;
}


