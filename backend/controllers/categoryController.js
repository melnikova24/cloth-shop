import {validationResult} from "express-validator";
import {ApiError} from "../utils/api-error.js";
import {
    createCategory,
    editCategory,
    receiveCategories,
    receiveCategory,
    removeCategory
} from "../services/category-service.js";


export async function postCategory (req, res, next) {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return next(ApiError.BadRequest('Ошибка валидации', validationErrors.array()));
        }
        const category = await createCategory(req.body);
        return res.status(200).json(category);
    } catch (e) {
        next(e);
    }
}

export async function deleteCategory (req, res, next) {
    try {
        const categoryId = req.params.id;
        const category = await removeCategory(categoryId);
        return res.status(200).json(category);
    } catch (e) {
        next(e);
    }
}

export async function getCategories (req, res, next) {
    try {
        const subTypeId = req.query.subTypeId;
        const categories = await receiveCategories(subTypeId);
        return res.status(200).json(categories);
    } catch (e) {
        next(e);
    }
}

export async function getCategory (req, res, next) {
    try {
        const categoryId = req.params.id;
        const category = await receiveCategory(categoryId);
        return res.status(200).json(category);
    } catch (e) {
        next(e);
    }
}

export async function putCategory (req, res, next) {
    try {
        const categoryId = req.params.id;
        const category = await editCategory(categoryId, req.body);
        return res.status(200).json(category);
    } catch (e) {
        next(e);
    }
}