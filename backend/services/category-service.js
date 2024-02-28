import {categoryModelM} from "../models/categoryModel.js";


export const createCategory = async ({ name, description, photo }) => {
    const category = await categoryModelM.create({ name, description, photo });
    category.save();
    return category;
};

export const editCategory = async (id, { name, description, photo }) => {
    const category = await categoryModelM.findByIdAndUpdate(id, { name, description, photo }, { new: true });
    return category;
}

export const removeCategory = async (id) => {
    const category = await categoryModelM.findByIdAndDelete(id);
    return category;
}

export const receiveCategory = async (id) => {
    const category = await categoryModelM.findById(id);
    return category;
}

export const receiveCategories = async () => {
    const categories = await categoryModelM.find();
    return categories;
}