export interface SupplierHistoryModalProps  {
  supplier: any;
  orders?: any[];
  onClose: () => void;
  onViewOrder: (id: string) => void;
}