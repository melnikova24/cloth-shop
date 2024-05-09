import {validationResult} from "express-validator";
import {ApiError} from "../utils/api-error.js";
import {createCart, editCart, receiveCart} from "../services/cart-service.js";
import {refresh as refreshTokenService} from "../services/user-service.js";
import {validateAccessToken} from "../services/token-service.js";


export async function postCart (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const userData = validateAccessToken(token);
        const {products} = req.body;
        const isCartExist = await receiveCart(userData._id);
        if (!isCartExist) {
            const cart = await createCart(userData._id, products);
            return res.status(200).json(cart);
        }
        const cart = await editCart(userData._id, req.body);
        return res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
}

export async function getCart (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const userData = validateAccessToken(token);
        const cart = await receiveCart(userData._id);
        return res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
}

