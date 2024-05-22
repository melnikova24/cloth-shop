import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    size: { type: String, required: true },
    color: { type: String, required: true },
    photos: { type: [String]},
    price: { type: Number, required: true }
});

export const productModel = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" , required: true },
    subTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "SubType" , required: true },
    name: { type: String, required: true, min: 2, max: 80 },
    description: { type: String },
    variants: [VariantSchema],
    selectedVariant: { type: VariantSchema }
})

export const productModelM = mongoose.model("Product", productModel);