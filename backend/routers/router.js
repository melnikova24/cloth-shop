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
import {removeCategory} from "../services/category-service.js";

const router = Router();

router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32}),
    register);


router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh', refresh);

router.get('/users', authMiddleware);

router.get('/categories', getCategories);
router.get('/categories/:id', getCategory);
router.post('/categories', authMiddleware, adminMiddleware, postCategory);
router.patch('/categories/:id', authMiddleware, adminMiddleware, putCategory);
router.delete('/categories/:id', authMiddleware, adminMiddleware, deleteCategory);






export {router};