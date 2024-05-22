import mongoose from "mongoose";
import {productModel} from "./productModel.js";

const cartModel = new mongoose.Schema({
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    productsList: [productModel]
})

export const cartModelM = mongoose.model("Cart", cartModel);