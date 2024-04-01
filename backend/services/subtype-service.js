import {subTypeModelM} from "../models/subType.js";


export const receiveSubtypes = async () => {
    const subtypes = await subTypeModelM.find();
    return subtypes;
}