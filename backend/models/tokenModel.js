import mongoose from "mongoose";

const tokenModel = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true },
})

export const tokenModelM = mongoose.model("Token", tokenModel);