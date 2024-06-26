import {ICategory} from "../categories";
import {ISubtype} from "../subtypes";

export type VariantProduct = {
  _id: number
  color: string
  price: number
  photos: string[]
  size: string
}

export type Product = {
  _id: string
  name: string
  description: string
  categoryId: string
  subTypeId: string
  category?: ICategory
  subType?: ISubtype
  variants: VariantProduct[]
  previewPhoto?: string
  inFavorite?: boolean
  inCart?: boolean
  selectedVariant?: VariantProduct
}
