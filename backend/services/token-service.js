import jwt from 'jsonwebtoken';
import {tokenModelM} from "../models/tokenModel.js";

export function  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    return {
        accessToken,
        refreshToken
    }
}

export function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}

export async function saveToken(userId, refreshToken) {
    const tokenData = await tokenModelM.findOne({ user: userId });

    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }

    const token = await tokenModelM.create({ user: userId, refreshToken });
    await token.save();

    return token;
}


export function validateAccessToken (token) {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
        return null
    }
}

export function validateRefreshToken (token) {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
        return null
    }
}

export async function findToken(refreshToken) {
    const tokenData = await tokenModelM.findOne({ refreshToken });
    return tokenData;
}