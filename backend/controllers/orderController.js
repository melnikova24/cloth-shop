
import {validateAccessToken} from "../services/token-service.js";
import {createOrder, editOrder, takeOrders} from "../services/order-service.js";


export async function getOrders (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const user = validateAccessToken(token);
        const cart = await takeOrders(user._id);
        return res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
}

export async function patchOrder (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const user = validateAccessToken(token);
        const {products, sumOfCart, status} = req.body;
        const order = await editOrder(user._id, products, sumOfCart, status);
        return res.status(200).json(order);
    } catch (e) {
        next(e);
    }
}

export async function postOrder (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const user = validateAccessToken(token);
        const {products, sumOfCart} = req.body;
        const order = await createOrder(user._id, products, sumOfCart);
        return res.status(200).json(order);
    } catch (e) {
        next(e);
    }
}
