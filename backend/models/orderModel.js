import mongoose, {model} from 'mongoose';
import {productModel} from "./productModel.js";

export const orderSchema = new mongoose.Schema({
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true },
    orderDate: { type: Date, default: Date.now },
    products: [productModel],
    sumOfCart: { type: Number, required: true },
    status: { type: String, default: 'В обработке' }
})

export const orderModel = model('Order', orderSchema);