import mongoose, {model, mongo} from 'mongoose';

const userModel = new mongoose.Schema({
    name: { type: String, required: true, min: 2, max: 30 },
    email: { type: String, required: true, min: 6, max: 30, unique: true },
    password: { type: String, required: true, min: 8, max: 70 },
    role: [{ type: String, ref: "Role" }],
})

export const userModelM = model('User', userModel);