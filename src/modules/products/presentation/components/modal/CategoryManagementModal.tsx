'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  GripVertical, 
  Plus, 
  Save,
  FolderOpen,
  Folder,
  Loader2,
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Category } from '@/modules/products/domain/entities/product.entity';
import { DeleteCategoryConfirmModal } from './DeleteCategoryConfirmModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CategoryManagementModalProps } from '@/modules/products/types/category-management-modal-props.type';
import { SortableCategoryItem } from './SortableCategoryItem';






export function CategoryManagementModal({ 
  isOpen, 
  onClose, 
  categories, 
  onReorder, 
  onCreate, 
  onUpdate, 
  onDelete,
  isMutating
}: CategoryManagementModalProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['cat-1', 'cat-2']));
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [parentForNew, setParentForNew] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  // Build tree structure
  const hierarchicalCategories = useMemo(() => {
    const map = new Map<string, Category & { children: any[] }>();
    categories.forEach(cat => map.set(cat.id, { ...cat, children: [] }));
    
    const roots: any[] = [];
    map.forEach(cat => {
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(cat);
      } else {
        roots.push(cat);
      }
    });

    // Sort by displayOrder
    const sortTree = (nodes: any[]) => {
      nodes.sort((a, b) => a.displayOrder - b.displayOrder);
      nodes.forEach(node => {
        if (node.children.length > 0) sortTree(node.children);
      });
      return nodes;
    };

    return sortTree(roots);
  }, [categories]);

  // Flattened visible list for sorting
  const visibleItems = useMemo(() => {
    const flattened: { id: string; depth: number; category: Category }[] = [];
    
    const process = (nodes: any[], depth = 0) => {
      nodes.forEach(node => {
        flattened.push({ id: node.id, depth, category: node });
        if (expandedIds.has(node.id) && node.children.length > 0) {
          process(node.children, depth + 1);
        }
      });
    };

    process(hierarchicalCategories);
    return flattened;
  }, [hierarchicalCategories, expandedIds]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = visibleItems.findIndex(item => item.id === active.id);
      const newIndex = visibleItems.findIndex(item => item.id === over.id);

      const activeItem = visibleItems[oldIndex];
      const overItem = visibleItems[newIndex];

      // Simple implementation: reorder at same level
      // In a real hierarchical dnd, this is much more complex
      const newArr = arrayMove(categories, 
        categories.findIndex(c => c.id === active.id),
        categories.findIndex(c => c.id === over.id)
      );

      // Update display orders based on new array within respective parent
      const updatedArr = newArr.map((cat, idx) => ({
        ...cat,
        displayOrder: idx
      }));

      await onReorder(updatedArr);
    }
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;

    if (editingCategory) {
      await onUpdate(editingCategory.id, { name: newCategoryName });
    } else {
      await onCreate({ 
        name: newCategoryName, 
        parentId: parentForNew,
        displayOrder: categories.filter(c => c.parentId === parentForNew).length 
      });
    }

    setNewCategoryName('');
    setEditingCategory(null);
    setIsAdding(false);
    setParentForNew(undefined);
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNewCategoryName(cat.name);
    setIsAdding(true);
  };

  const startAddSub = (parentId: string) => {
    setParentForNew(parentId);
    setEditingCategory(null);
    setNewCategoryName('');
    setIsAdding(true);
    // Expand parent if adding sub
    const next = new Set(expandedIds);
    next.add(parentId);
    setExpandedIds(next);
  };

  const handleDeleteRequest = (cat: Category) => {
    setCategoryToDelete(cat);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await onDelete(categoryToDelete.id);
      setIsDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl pointer-events-auto"
            >
              <GlassCard className="flex flex-col max-h-[85vh] shadow-[0_32px_64px_rgba(91,58,41,0.15)]" radius="4xl">
                {/* Header */}
                <div className="p-6 border-b border-[#D8B894]/20 bg-white/40 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Folder size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#2A1E17]">Quản lý Danh mục</h2>
                      <p className="text-xs text-[#9A8677]">Kéo thả để sắp xếp thứ tự và cấu trúc menu.</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2.5 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
                  {isAdding && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-[24px] bg-primary/5 border border-primary/20"
                    >
                      <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest block mb-2 px-1">
                        {editingCategory ? 'Chỉnh sửa danh mục' : parentForNew ? 'Thêm danh mục con' : 'Thêm danh mục mới'}
                      </label>
                      <div className="flex gap-2">
                        <input 
                          autoFocus
                          type="text" 
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Tên danh mục..."
                          className="flex-1 glass-control rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
                        />
                        <button 
                          onClick={handleSaveCategory}
                          disabled={!newCategoryName.trim() || isMutating}
                          className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {isMutating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        </button>
                        <button 
                          onClick={() => { setIsAdding(false); setEditingCategory(null); setParentForNew(undefined); }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-[#6F5A4A] hover:bg-white transition-all"
                        >
                          Hủy
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={visibleItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1 pb-20">
                        {visibleItems.length > 0 ? (
                          visibleItems.map((item) => (
                            <SortableCategoryItem
                              key={item.id} 
                              category={item.category} 
                              depth={item.depth}
                              onEdit={startEdit}
                              onDeleteRequest={handleDeleteRequest}
                              onAddSub={startAddSub}
                              hasChildren={categories.some(c => c.parentId === item.id)}
                              isExpanded={expandedIds.has(item.id)}
                              onToggle={toggleExpand}
                            />
                          ))
                        ) : (
                          <div className="py-20 text-center text-[#9A8677]">
                             <Folder className="mx-auto mb-3 opacity-20" size={48} />
                             <p className="text-sm">Chưa có danh mục nào.</p>
                          </div>
                        )}
                      </div>
                    </SortableContext>

                    <DragOverlay>
                      {activeId ? (
                        <div className="flex items-center gap-3 p-3 rounded-2xl border bg-white border-primary shadow-2xl opacity-90 scale-105">
                           <GripVertical size={18} className="text-primary" />
                           <FolderOpen size={18} className="text-primary" />
                           <span className="font-bold text-[#2A1E17]">
                              {categories.find(c => c.id === activeId)?.name}
                           </span>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-between shrink-0">
                  <button 
                    onClick={() => { setIsAdding(true); setEditingCategory(null); setParentForNew(undefined); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <Plus size={18} />
                    Danh mục gốc
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 rounded-2xl bg-[#8B5E3C] text-white text-sm font-bold shadow-lg shadow-[#8B5E3C]/20 hover:bg-[#5B3A29] transition-all active:scale-[0.98]"
                  >
                    Hoàn tất
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <DeleteCategoryConfirmModal 
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            category={categoryToDelete}
            onConfirm={handleConfirmDelete}
            isDeleting={isMutating}
          />
        </>
      )}
    </AnimatePresence>
  );
}
