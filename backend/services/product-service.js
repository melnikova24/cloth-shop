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

export const receiveProducts = async (params) => {
    const query = {}
    if (params.categoryId) {
        query.categoryId = params.categoryId
    }
    if (params.minPrice || params.maxPrice) {
        query.variants = {
            $elemMatch: {}
        };

        if (params.minPrice) {
            query.variants.$elemMatch.price = {
                $gte: Number(params.minPrice)
            };
        }

        if (params.maxPrice) {
            query.variants.$elemMatch.price = {
                ...query.variants.$elemMatch.price,
                $lte: Number(params.maxPrice)
            };
        }
    }
    if (params.sizes) {
        query.variants = {
            $elemMatch: {
                size: {
                    $in: params.sizes
                }
            }
        }
    }
    if (params.name) {
        query.name = {
            $regex: params.name,
            $options: 'i'
        }
    }
    if (params.colors) {
        query.variants = {
            $elemMatch: {
                color: {
                    $in: params.colors
                }
            }
        }
    }
    if (params.subTypeId) {
        query.subTypeId = params.subTypeId
    }

    return productModelM.find(query);
}

export const productFilters = async () => {
    const sizes = await productModelM.distinct('variants.size')
    const colors = await productModelM.distinct('variants.color')
    return {sizes, colors}
}