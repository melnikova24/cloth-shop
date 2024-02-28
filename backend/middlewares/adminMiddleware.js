import {ApiError} from "../utils/api-error.js";
import {validateAccessToken} from "../services/token-service.js";
import {isAdmin} from "../services/user-service.js";


export async function adminMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = validateAccessToken(token);
        const isAdminCheck = await isAdmin(decoded._id);

        if (!isAdminCheck) {
            return next(new ApiError(403, 'У вас нет прав администратора'))
        }

        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}