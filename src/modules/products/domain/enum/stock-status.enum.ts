
export type StockStatus =
  | "Còn hàng"
  | "Hết hàng"
  | "Sắp hết"
  | "Đặt trước";

export enum StockStatusEnum {
  IN_STOCK = "Còn hàng",
  OUT_OF_STOCK = "Hết hàng",
  LOW_STOCK = "Sắp hết",
  PRE_ORDER = "Đặt trước",
}

export type T_STOCK_STATUS = keyof typeof StockStatusEnum;


// return:
// [
//   { value: "IN_STOCK", label: "Còn hàng" },
//   { value: "OUT_OF_STOCK", label: "Hết hàng" },
//   ...
// ]
export const ArrStockStatus = Object.entries(StockStatusEnum).map(
  ([key, value]) => ({
    value: key,
    label: value,
  })
);

// return: ["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK", "PRE_ORDER"]
export const StockStatusKeys = Object.keys(StockStatusEnum);

// return ["Còn hàng", "Hết hàng", "Sắp hết", "Đặt trước"]
export const StockStatusValues = Object.values(StockStatusEnum);
