import { Category } from "../domain/entities/product.entity";

export interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onReorder: (updated: Category[]) => Promise<any>;
  onCreate: (data: Partial<Category>) => Promise<any>;
  onUpdate: (id: string, data: Partial<Category>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  isMutating?: boolean;
}
