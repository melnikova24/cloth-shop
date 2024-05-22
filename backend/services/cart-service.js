import {cartModelM} from "../models/cartModel.js";

export const createCart = async ( userId, productIds, productsList ) => {
    const cart = await cartModelM.create({ personId: userId, products: productIds, productsList: productsList });
    await cart.save();
    return cart;
}

export const editCart = async (personId, productIds, productsList) => {
    const cart = await cartModelM.findOneAndUpdate({personId}, {products: productIds, productsList}, {new: true});
    return cart;
}

export const receiveCart = async (personId) => {
    const cart = await cartModelM.findOne({personId});
    if (!cart) {
        const cart = await createCart(personId, [], []);
        return cart;
    };
    return cart;
}


