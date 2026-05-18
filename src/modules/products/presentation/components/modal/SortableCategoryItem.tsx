import { SortableItemProps } from "@/modules/products/types/sortable-item-props.type";
import { cn } from "@/shared/utils/cn";
import { useSortable } from "@dnd-kit/sortable";
import { ChevronDown, ChevronRight, Edit2, Folder, FolderOpen, FolderPlus, GripVertical, Trash2 } from "lucide-react";
import { CSS } from '@dnd-kit/utilities';


export function SortableCategoryItem({ 
  category, 
  depth, 
  onEdit, 
  onDeleteRequest, 
  onAddSub, 
  hasChildren, 
  isExpanded, 
  onToggle 
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 24}px`,
  };

  return (
    <div ref={setNodeRef} style={style}
      className={cn(
        "relative mb-2 group",
        isDragging && "z-50 opacity-50"
      )}
    >
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border transition-all",
        "bg-white/60 border-[#D8B894]/20 hover:border-primary/30 hover:shadow-sm",
        isDragging && "shadow-xl border-primary bg-white"
      )}>
        <button 
          {...attributes} 
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-[#D8B894] hover:text-primary"
        >
          <GripVertical size={18} />
        </button>

        <button 
          onClick={() => onToggle(category.id)}
          className={cn(
            "p-1 text-[#9A8677] hover:text-primary transition-opacity",
            !hasChildren && "opacity-0 cursor-default"
          )}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          {hasChildren ? (
            isExpanded ? <FolderOpen size={18} className="text-primary flex-shrink-0" /> : <Folder size={18} className="text-primary flex-shrink-0" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0 mx-2" />
          )}
          <span className="font-bold text-[#2A1E17] truncate">{category.name}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onAddSub(category.id)}
            className="p-2 text-[#9A8677] hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
            title="Thêm danh mục con"
          >
            <FolderPlus size={16} />
          </button>
          <button 
            onClick={() => onEdit(category)}
            className="p-2 text-[#6F5A4A] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-[#D8B894]/20"
            title="Chỉnh sửa"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDeleteRequest(category)}
            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}