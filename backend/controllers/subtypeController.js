
import {ApiError} from "../utils/api-error.js";
import {receiveSubtypes} from "../services/subtype-service.js";





export async function getSubtypes (req, res, next) {
    try {
        const subtypes = await receiveSubtypes();
        return res.status(200).json(subtypes);
    } catch (e) {
        next(e);
    }
}