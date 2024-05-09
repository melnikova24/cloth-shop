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
import {
    deleteProduct,
    getProduct,
    getProductFilters,
    getProducts,
    patchProduct,
    postProduct
} from "../controllers/productController.js";
import {postCart, getCart} from "../controllers/cartController.js";
import {getSubtypes} from "../controllers/subtypeController.js";



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
router.get('/products-filters', getProductFilters);
router.get('/products/:id', getProduct);
router.post('/products', authMiddleware, adminMiddleware, postProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);
router.patch('/products/:id', authMiddleware, adminMiddleware, patchProduct);
//Конец товаров

//Корзина
router.post('/cart', authMiddleware, postCart);
router.get('/cart', authMiddleware, getCart);
//Конец корзины

//Тип одежды
router.get('/subtypes', getSubtypes);
//Тип одежды

export {router};