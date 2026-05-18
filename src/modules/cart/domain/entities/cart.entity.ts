export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalAmount: number;
}
