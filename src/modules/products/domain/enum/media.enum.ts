
export enum EEntityType {
  "PRODUCT" = "product",
  "PRODUCT_VARIANT" = "product_variant",
  "USER" = "user",
  "BRANCH" = "branch",
  "CATEGORY" = "category",
  "BANNER" = "banner",
  "AVATAR" = "avatar"
}
export type TEntityType = keyof typeof EEntityType




export enum EMediaType {
  "IMAGE" = "image",
  "VIDEO" = "video",
}
export type TMediaType = keyof typeof EMediaType