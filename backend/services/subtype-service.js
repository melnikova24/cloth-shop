import {subTypeModelM} from "../models/subType.js";


export const receiveSubtypes = async () => {
    const subtypes = await subTypeModelM.find();
    let subTypesObj = {};
    subtypes.forEach(subtype => {
        subTypesObj[subtype.name] = subtype._id;
    })

    return subTypesObj;
}