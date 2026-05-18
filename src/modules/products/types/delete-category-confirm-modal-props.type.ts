import { Category } from "../domain/entities/product.entity";

export interface DeleteCategoryConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}