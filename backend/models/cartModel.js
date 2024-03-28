import mongoose from "mongoose";


const cartModel = new mongoose.Schema({
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
})

export const cartModelM = mongoose.model("Cart", cartModel);