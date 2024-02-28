import mongoose, {model} from "mongoose";


const roleModel = new mongoose.Schema({
    name: { type: String, required: true, default: "user" },
})

module.exports = model('Role', roleModel);