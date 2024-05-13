import {cartModelM} from "../models/cartModel.js";

export const createCart = async ( userId, productIds ) => {
    const cart = await cartModelM.create({ personId: userId, products: productIds });
    await cart.save();
    return cart;
}

export const editCart = async (personId, productIds) => {
    console.log(productIds, 'productIds')
    const cart = await cartModelM.findOneAndUpdate({personId}, {products: productIds}, {new: true});
    console.log(cart, 'cart')
    return cart;
}

export const receiveCart = async (personId) => {
    const cart = await cartModelM.findOne({personId});
    if (!cart) {
        const cart = await createCart(personId, []);
        return cart;
    };
    return cart;
}


