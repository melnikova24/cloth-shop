import mongoose from "mongoose";
import {productModelM} from "./productModel.js";

const categoryModel = new mongoose.Schema({
    name: { type: String, required: true, min: 2, max: 80 },
    description: { type: String },
    photo: { type: String },
})

categoryModel.pre('findOneAndDelete', async function (next) {
    const categoryId = this.getQuery()._id;
    try {
        await productModelM.deleteMany({ categoryId: categoryId });
        next();
    } catch (error) {
        next(error);
    }
});

export const categoryModelM = mongoose.model("Category", categoryModel);