import { Product } from "../domain/entities/product.entity";

export interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}