export type VariantProduct = {
  _id: number
  color: string
  price: number
  photo: string[]
  size: string
}

export type Product = {
  _id: number
  name: string
  description: string
  variants: VariantProduct[]
}
