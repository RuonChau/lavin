import { Category, Product } from "../domain/entities/product.entity";
import { EditProductFormData } from "../validations/edit-product.schema";

export interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSubmit: (data: EditProductFormData) => void;
  isSubmitting?: boolean;
}
