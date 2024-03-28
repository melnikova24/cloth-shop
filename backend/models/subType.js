import mongoose from "mongoose";


const subTypeModel = new mongoose.Schema({
    name: { type: String, required: true, min: 2, max: 80 },
    description: { type: String },
})

export const subTypeModelM = mongoose.model("SubType", subTypeModel);