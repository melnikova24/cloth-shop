import mongoose, {model} from 'mongoose';

const userModel = new mongoose.Schema({
    name: { type: String, required: true, min: 2, max: 30 },
    email: { type: String, required: true, min: 6, max: 30, unique: true },
    password: { type: String, required: true, min: 8, max: 70 },
    role: [{ type: String, default: "user" }],
})

export const userModelM = model('User', userModel);