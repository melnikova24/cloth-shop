import {categoryModelM} from "../models/categoryModel.js";
import {subTypeModelM} from "../models/subType.js";


export const createCategory = async ({ name, description, photo, subTypeId }) => {
    const category = await categoryModelM.create({ name, description, photo, subTypeId });
    category.save();
    return category;
};

export const editCategory = async (id, { name, description, photo, subTypeId }) => {
    const category = await categoryModelM.findByIdAndUpdate(id, { name, description, photo, subTypeId }, { new: true });
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

export const receiveCategories = async (subTypeId) => {
    const types = await subTypeModelM.find();
    if (subTypeId === 'all') {
        const categories = await categoryModelM.find();
        return categories.map(category => {
            return {
                ...category.toObject(),
                subType: types.find(type => type._id.toString() === category.subTypeId.toString())
            }
        })
    }
    const categories = await categoryModelM.find({subTypeId});
    return categories.map(category => {
        return {
            ...category.toObject(),
            subType: types.find(type => type._id.toString() === category.subTypeId.toString())
        }
    });
}

