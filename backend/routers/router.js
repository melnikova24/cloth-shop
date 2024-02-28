import { Router } from 'express';
import {login, logout, register, refresh} from '../controllers/userController.js'
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/authMiddleware.js";

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


export {router};