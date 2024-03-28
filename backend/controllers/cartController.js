import {validationResult} from "express-validator";
import {ApiError} from "../utils/api-error.js";
import {createCart, editCart, receiveCart} from "../services/cart-service.js";
import {refresh as refreshTokenService} from "../services/user-service.js";


export async function postCart (req, res, next) {
    try {
        const {refreshToken} = req.cookies;
        const {products} = req.body;
        const userData = await refreshTokenService(refreshToken);
        const isCartExist = await receiveCart(userData.id);
        if (!isCartExist) {
            const cart = await createCart(userData.id, products);
            return res.status(200).json(cart);
        }
        const cart = await editCart(userData.id, req.body);
        return res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
}

export async function getCart (req, res, next) {
    try {
        const {refreshToken} = req.cookies;
        const userData = await refreshTokenService(refreshToken);
        const cart = await receiveCart(userData.id);
        return res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
}

