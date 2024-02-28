import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
    size: { type: String, required: true },
    color: { type: String, required: true },
    photos: { type: [String]},
    price: { type: Number, required: true }
});


const productModel = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    name: { type: String, required: true, min: 2, max: 80 },
    description: { type: String },
    variants: [VariantSchema]
})

export const productModelM = mongoose.model("Product", productModel);