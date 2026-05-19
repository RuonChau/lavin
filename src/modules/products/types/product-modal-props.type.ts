// src/modules/products/types/product-modal-props.type.ts

import type { Category } from '../domain/entities/product.entity';
import type { ProductFormData } from '../validations/add-product.schema';

export interface VariantImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export interface AddProductSubmitOptions {
  is_draft: boolean;
  size_images: Record<string, VariantImageItem[]>;
}

export interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: ProductFormData, options: AddProductSubmitOptions) => void;
  isSubmitting?: boolean;
}
