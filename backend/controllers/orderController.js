
import {validateAccessToken} from "../services/token-service.js";
import {createOrder, editOrder, takeAllOrders, takeOrders} from "../services/order-service.js";
import {userModelM} from "../models/userModel.js";


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

export async function getAllOrders (req, res, next) {
    try {
        // const token = req.headers.authorization.split(' ')[1]
        // const user = validateAccessToken(token);

        const cart = await takeAllOrders();
        const res1 = {
            user: {},
            orders: cart
        }
        const ordersWithUsers = await Promise.all(cart.map(async (order) => {
            const user = await userModelM.findById(order.personId);
            const {password, ...rest} = user._doc;
            return { user: rest, ...order._doc };
        }));

        return res.status(200).json(ordersWithUsers);
    } catch (e) {
        next(e);
    }
}


export async function patchOrder (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const user = validateAccessToken(token);
        const id = req.params.id;
        const {products, sumOfCart, status} = req.body;
        const order = await editOrder(id, user._id, products, sumOfCart, status);
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
