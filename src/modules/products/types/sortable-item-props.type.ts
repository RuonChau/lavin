import { Category } from "../domain/entities/product.entity";

export interface SortableItemProps {
  category: Category;
  depth: number;
  onEdit: (cat: Category) => void;
  onDeleteRequest: (cat: Category) => void;
  onAddSub: (parentId: string) => void;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}