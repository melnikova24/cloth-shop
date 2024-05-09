import {validationResult} from "express-validator";
import {ApiError} from "../utils/api-error.js";
import {
    createProduct,
    editProduct, productFilters,
    receiveProduct,
    receiveProducts,
    removeProduct
} from "../services/product-service.js";


export async function postProduct (req, res, next) {
    try {
        console.log(1)
        // const validationErrors = validationResult(req);
        //
        // if (!validationErrors.isEmpty()) {
        //     return next(ApiError.BadRequest('Ошибка валидации', validationErrors.array()));
        // }
        const product = await createProduct(req.body);
        return res.status(200).json(product);
    } catch (e) {
        console.log(e)
        next(e);
    }
}

export async function deleteProduct (req, res, next) {
    try {
        const productId = req.params.id;
        const product = await removeProduct(productId);
        return res.status(200).json(product);
    } catch (e) {
        next(e);
    }
}

export async function getProducts (req, res, next) {
    try {
        const params = req.query;
        const products = await receiveProducts(params);

        return res.status(200).json(products);
    } catch (e) {
        next(e);
    }
}

export async function getProduct (req, res, next) {
    try {
        const productId = req.params.id;
        const product = await receiveProduct(productId);
        return res.status(200).json(product);
    } catch (e) {
        next(e);
    }
}

export async function patchProduct (req, res, next) {
    try {
        const productId = req.params.id;
        const product = await editProduct(productId, req.body);
        return res.status(200).json(product);
    } catch (e) {
        next(e);
    }
}

export async function getProductFilters (req, res, next) {
    try {
        const filters = await productFilters(req.query);
        return res.status(200).json(filters);
    } catch (e) {
        next(e);
    }
}