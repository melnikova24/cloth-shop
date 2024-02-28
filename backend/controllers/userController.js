
import {
    register as registration,
    login as loginService,
    logout as logoutService,
    refresh as refreshTokenService
} from "../services/user-service.js";
import {validationResult} from "express-validator";
import {ApiError} from "../utils/api-error.js";

const cookieMaxAge = 30 * 24 * 60 * 60 * 1000;

export async function register (req, res, next) {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return next(ApiError.BadRequest('Ошибка валидации', validationErrors.array()));
        }
        const userData = await registration(req.body);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: cookieMaxAge, httpOnly: true});
        return res.status(200).json(userData);
    } catch (e) {
        next(e);
    }
}

export async function login (req, res, next) {
    try {
        const userData = await loginService(req.body);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: cookieMaxAge, httpOnly: true});
        return res.status(200).json(userData);
    } catch (e) {
        next(e);
    }
}

export async function logout (req, res, next) {
    try {
        const {refreshToken} = req.cookies;
        const token = await logoutService(refreshToken);
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

export async function refresh (req, res, next) {
    try {
        const {refreshToken} = req.cookies;
        const userData = await refreshTokenService(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: cookieMaxAge, httpOnly: true});
        return res.json(userData);
    } catch (e) {
        next(e);
    }
}