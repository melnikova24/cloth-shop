import { Router } from 'express';
import {login, logout, register, refresh} from '../controllers/userController.js'
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import {
    deleteCategory,
    getCategories,
    getCategory,
    postCategory,
    putCategory
} from "../controllers/categoryController.js";
import {adminMiddleware} from "../middlewares/adminMiddleware.js";
import {deleteProduct, getProduct, getProducts, patchProduct, postProduct} from "../controllers/productController.js";
import {removeProduct} from "../services/product-service.js";

const router = Router();

//Авторизация
router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32}),
    register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh', refresh);
//Конец Авторизации

//Категории
router.get('/categories', getCategories);
router.get('/categories/:id', getCategory);
router.post('/categories', authMiddleware, adminMiddleware, postCategory);
router.patch('/categories/:id', authMiddleware, adminMiddleware, putCategory);
router.delete('/categories/:id', authMiddleware, adminMiddleware, deleteCategory);
//Конец Категории

//Товары
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.post('/products', authMiddleware, adminMiddleware, postProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);
router.patch('/products/:id', authMiddleware, adminMiddleware, patchProduct);
//Конец товаров


export {router};