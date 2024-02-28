import {ApiError} from "../utils/api-error.js";
import {validateAccessToken} from "../services/token-service.js";


export function authMiddleware(req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return next(ApiError.UnauthorizedError())
        }

        const decoded = validateAccessToken(token);
        if (!decoded) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = decoded
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}