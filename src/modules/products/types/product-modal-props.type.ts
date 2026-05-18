// src/modules/products/types/product-modal-props.type.ts

import type { Category } from '../domain/entities/product.entity';
import type { ProductFormData } from '../validations/add-product.schema';

export interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}