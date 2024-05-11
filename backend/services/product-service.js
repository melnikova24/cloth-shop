import {productModelM} from "../models/productModel.js";
import {categoryModelM} from "../models/categoryModel.js";
import {subTypeModelM} from "../models/subType.js";

export const createProduct = async ({ categoryId, name, description, variants, subTypeId }) => {
    console.log({ categoryId, name, description, variants, subTypeId })
    const product = await productModelM.create({ categoryId, name, description, variants, subTypeId });
    product.save();
    return product;
}

export const editProduct = async (id, { categoryId, name, description, variants, subTypeId }) => {
    const product = await productModelM.findByIdAndUpdate(id, { categoryId, subTypeId, name, description, variants }, { new: true });
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
    console.log(params, 'params')
    const query = {}
    if (params.categoryId && params.categoryId !== 'null') {
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
    if (params.sizes && params.sizes !== 'null') {
        query.variants = {
            $elemMatch: {
                size: {
                    $in: params.sizes
                }
            }
        }
    }
    if (params.name && params.name !== 'null') {
        query.name = {
            $regex: params.name,
            $options: 'i'
        }
    }
    if (params.colors && params.colors !== 'null') {
        query.variants = {
            $elemMatch: {
                color: {
                    $in: params.colors
                }
            }
        }
    }
    if (params.subTypeId && params.subTypeId !== 'null') {
        query.subTypeId = params.subTypeId
    }
    const categories = await categoryModelM.find()
    const subtypes = await subTypeModelM.find()
    const products = await productModelM.find(query)
    const productsWithCategories = products.map(product => {
        const category = categories.find(category => category._id.toString() === product.categoryId.toString())
        const subType = subtypes.find(subType => subType._id.toString() === product.subTypeId.toString())
        return {...product.toObject(), category, subType}
    })

    return productsWithCategories;
}

export const productFilters = async (params) => {
    if (params.subTypeId === 'all') {
        const sizes = await productModelM.find().distinct('variants.size')
        const colors = await productModelM.find().distinct('variants.color')
        return {sizes, colors}
    }
    const sizes = await productModelM.find({ subTypeId: params.subTypeId }).distinct('variants.size')
    const colors = await productModelM.find({ subTypeId: params.subTypeId }).distinct('variants.color')
    return {sizes, colors}
}

export const latestItems = async () => {
    const products = await productModelM.find().sort({createdAt: -1}).limit(4)
    return products
}