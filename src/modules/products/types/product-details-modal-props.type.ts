import { Category, Product } from "../domain/entities/product.entity";

export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
}