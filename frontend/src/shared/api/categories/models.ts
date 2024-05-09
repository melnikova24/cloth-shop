import {ISubtype} from "../subtypes";

export interface ICategory {
  _id: string;
  name: string;
  photo: string;
  description: string;
  subTypeId: number;
  subType?: ISubtype;
}
