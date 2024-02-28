import {productModelM} from "../models/productModel.js";


export const createProduct = async ({ categoryId, name, description, variants }) => {
    const product = await productModelM.create({ categoryId, name, description, variants });
    product.save();
    return product;
}

export const editProduct = async (id, { categoryId, name, description, variants }) => {
    const product = await productModelM.findByIdAndUpdate(id, { categoryId, name, description, variants }, { new: true });
    return product;
}

export const removeProduct = async (id) => {
    const product = await productModelM.findByIdAndDelete(id);
    return product;
}

export const receiveProduct = async (id) => {
    const product = await productModelM.findById(id);
    return product;
}

export const receiveProducts = async () => {
    const products = await productModelM.find();
    return products;
}